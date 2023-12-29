import { PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';
import { ReadPool } from './pools';
import { StoreType, UserType } from '@ts-types/interfaces';
import { ACTION_PRIVILEGES, RESOURCES } from '@ts-types/enums';
// import {
//   ExtendedGraphQlError,
//   ForbiddenError,
//   TransactionError,
// } from '@core/Errors';
import { Logger } from '@core';
import { getStoreIdByAlias, setSessionAlias, setSessionStoreId } from '@sql';

declare module 'pg' {
  export interface PoolClient {
    lastQuery?: unknown[];
    store: StoreType;
    user: UserType;
    alias: string;
  }
}

export default class PostgresClient {
  /** @readonly */
  protected readonly ACTION_PRIVILEGES: typeof ACTION_PRIVILEGES;
  /** @readonly */
  protected readonly RESOURCES: typeof RESOURCES;

  constructor() {
    this.ACTION_PRIVILEGES = ACTION_PRIVILEGES;
    this.RESOURCES = RESOURCES;
  }

  /**
   * Used for internal operations only, since it doesn't check for user role
   * @param QueryPermissionType
   * @returns {Promise<PoolClient>}
   */
  protected transaction = async (): Promise<PoolClient> => {
    try {
      const client: PoolClient = await ReadPool.connect();

      const query = client.query;
      const release = client.release;

      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!');
        console.error(
          `The last executed query on this client was: ${client.lastQuery}`
        );
        Logger.database.warn({
          message: `A client has been checked out for more than 5 seconds! The last executed query on this client was: ${client.lastQuery}`,
        });
      }, 5000);

      // monkey patch the query method to keep track of the last query executed
      // @ts-ignore
      client.query = (...args: unknown[]) => {
        client.lastQuery = args;
        // @ts-ignore
        return query.apply(client, args);
      };
      client.release = async () => {
        // clear our timeout
        clearTimeout(timeout);
        // set the methods back to their old un-monkey-patched version
        client.query = query;
        client.release = release;
        return release.apply(client);
      };
      return client;
    } catch (error) {
      console.log(error);
      Logger.database.error(error);
      throw error; //TransactionError('Unknown error!', { error, location: 'A1' });
    }
  };

  protected async query<T extends QueryResultRow>(
    queryConfig: QueryConfig<any[]>
  ): Promise<QueryResult<T>> {
    return await ReadPool.query<T>(queryConfig);
  }

  protected async setupStoreSessions(
    client: PoolClient,
    { alias, storeId }: { alias: string; storeId?: string }
  ) {
    let store: StoreType | null = null;

    if (alias) {
      /** Set alias session for RLS **/
      await client.query(setSessionAlias(alias));
    }

    if (!storeId) {
      /** Set email session for RLS to access the user_account table **/
      const { rows: placeholderUuidRows } = await client.query(
        `SELECT uuid_nil()`
      );
      const { uuid_nil } = placeholderUuidRows[0];
      /** Set default value for uuid as placeholder **/
      await client.query(setSessionStoreId(uuid_nil));

      /** Get store id by alias **/
      const { rows: storeRows } = await client.query<StoreType>(
        getStoreIdByAlias()
      );
      store = storeRows[0] ?? {};
    }
    const id = store?.id ?? storeId;
    if (id) {
      /** Set store id session for RLS **/
      await client.query(setSessionStoreId(id));
    } else {
      await client.query('ROLLBACK');
      return { error: { message: `Store alias:"${alias}" not found` } };
    }
    return { error: null, alias, storeId: id };
  }
}
