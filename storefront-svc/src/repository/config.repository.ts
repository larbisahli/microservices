import PostgresClient from '@database';
import { Service } from 'typedi';
import { LanguageQueries, SettingsQueries } from '@sql';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Settings__Output } from '@proto/generated/settings/Settings';
import { ConfigCacheStore } from '@cache/config.store';
import { LanguageCacheStore } from '@cache/language.store';


@Service()
export default class ConfigRepository extends PostgresClient {
  /**
  * @param {SettingsQueries} settingsQueries
  * @param {ConfigCacheStore} configCacheStore
  * @param {LanguageCacheStore} languageCacheStore
  * @param {LanguageQueries} languageQueries
  */
  constructor(
    protected settingsQueries: SettingsQueries,
    protected configCacheStore: ConfigCacheStore,
    protected languageCacheStore: LanguageCacheStore,
    protected languageQueries: LanguageQueries
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<ProductRequest, ProductResponse>} call
   * @returns {Promise<ProductInterface>}
   */
  public getStoreConfig = async ({
    alias, storeId
  }: {
    alias: string;
    storeId?: string;
  }): Promise<{ config: Settings__Output | null; error: any }> => {

    const { getStoreSettings } = this.settingsQueries;

    /** Check if resource is in the cache store */
    const resource = (await this.configCacheStore.getConfig({
      alias,
    })) as { config: Settings__Output | null };

    if (!!resource?.config) {
      return { error: null, ...resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          config: null
        };
      }

      const { rows } = await client.query<Settings__Output>(getStoreSettings());

      const config = rows[0];

      /** Set the resources in the cache store */
      if (config && alias) {
        this.configCacheStore.setConfig({
          store,
          resource: config,
        });
      }

      await client.query('COMMIT');

      return { config, error: null };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: { message },
        config: null,
      };
    } finally {
      client.release();
    }
  };
}