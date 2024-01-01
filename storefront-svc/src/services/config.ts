import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { LanguageQueries, SettingsQueries } from '@sql';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ConfigRequest } from '@proto/generated/settings/ConfigRequest';
import { ConfigResponse } from '@proto/generated/settings/ConfigResponse';
import { Settings__Output } from '@proto/generated/settings/Settings';
import { Language } from '@proto/generated/language/Language';
import { LanguageRequest } from '@proto/generated/language/LanguageRequest';
import { LanguageResponse } from '@proto/generated/language/LanguageResponse';
import { ConfigCacheStore } from '@cache/config.store';
import { LanguageCacheStore } from '@cache/language.store';

@Service()
export default class ConfigHandler extends PostgresClient {
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
   * @param { ServerUnaryCall<StoreConfigRequest, StoreConfigResponse>} call
   * @returns {Promise<Settings__Output>}
   */
  public getStoreConfig = async (
    call: ServerUnaryCall<ConfigRequest, ConfigResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { config: Settings__Output | null };
  }> => {
    const { getStoreSettings } = this.settingsQueries;
    const { alias, storeId } = call.request;

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
    const resource = (await this.configCacheStore.getConfig({
      alias,
    })) as { config: Settings__Output | null };

    if (resource) {
      return { error: null, response: resource };
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
          response: { config: null },
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

  /**
   * @param { ServerUnaryCall<StoreConfigRequest, StoreConfigResponse>} call
   * @returns {Promise<{ language: Language | null }>}
   */
  public getStoreLanguage = async (
    call: ServerUnaryCall<LanguageRequest, LanguageResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { language: Language | null };
  }> => {
    const { getLanguage } = this.languageQueries;
    const { alias, storeId, id } = call.request;

    if (!alias || !id) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { language: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.languageCacheStore.getLanguage({
      alias,
    })) as { language: Language | null };

    if (resource) {
      return { error: null, response: resource };
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
          response: { language: null },
        };
      }

      const { rows } = await client.query<Language>(getLanguage(id));

      const language = rows[0];

      /** Set the resources in the cache store */
      if (language && alias) {
        this.languageCacheStore.setLanguage({
          store,
          resource: language,
        });
      }

      await client.query('COMMIT');

      return { response: { language }, error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { language: null },
      };
    } finally {
      client.release();
    }
  };
}
