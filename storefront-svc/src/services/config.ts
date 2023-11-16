import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { SettingsQueries } from '@sql';
import { ResourceHandler } from '@cache/resource.store';
import { StoreConfigRequest } from '@proto/generated/SettingsPackage/StoreConfigRequest';
import { StoreConfigResponse } from '@proto/generated/SettingsPackage/StoreConfigResponse';
import { Settings__Output } from '@proto/generated/SettingsPackage/Settings';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class ConfigHandler extends PostgresClient {
  /**
   * @param {SettingsQueries} settingsQueries
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected settingsQueries: SettingsQueries,
    protected resourceHandler: ResourceHandler
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<StoreConfigRequest, StoreConfigResponse>} call
   * @returns {Promise<Settings__Output>}
   */
  public getStoreConfig = async (
    call: ServerUnaryCall<StoreConfigRequest, StoreConfigResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { config: Settings__Output | null };
  }> => {
    const { getStoreSettings } = this.settingsQueries;
    const { alias } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { config: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: 'storeConfig',
      packageName: 'storeConfig',
    })) as { config: Settings__Output | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction(alias);

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          response: { config: null },
        };
      }
      const { rows } = await client.query<Settings__Output>(getStoreSettings());

      const config = rows[0];

      /** Set the resources in the cache store */
      if (config && alias) {
        this.resourceHandler.setResource({
          alias,
          resourceName: 'storeConfig',
          packageName: 'storeConfig',
          resource: config,
        });
      }

      await client.query('COMMIT');

      return { response: { config }, error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { config: null },
      };
    } finally {
      client.release();
    }
  };
}
