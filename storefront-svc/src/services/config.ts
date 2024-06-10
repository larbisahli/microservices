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
import ConfigRepository from '@repository/config.repository';
import { CryptoUtils } from '@core';

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
    protected languageQueries: LanguageQueries,
    protected configRepository: ConfigRepository,
    protected cryptoUtils: CryptoUtils
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
    const { alias, suid } = call.request;

    console.log('??????????', { alias, suid });

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier 1 is not defined',
        },
        response: { config: null },
      };
    }

    let storeId: string | null;
    if (suid) {
      storeId = await this.cryptoUtils.decrypt(suid);
    } else {
      storeId = await this.getStoreId({ alias });
    }

    if (!storeId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'store identifier 2 is not defined',
        },
        response: { config: null },
      };
    }

    try {
      const { config, error } = await this.configRepository.getStoreConfig(
        storeId
      );
      if (error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: error.message,
          },
          response: { config: null },
        };
      }
      return { response: { config }, error: null };
    } catch (error: any) {
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { config: null },
      };
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
    const { alias, suid, id } = call.request;

    if (!alias || !id) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier 1 is not defined',
        },
        response: { language: null },
      };
    }

    let storeId: string | null;
    if (suid) {
      storeId = await this.cryptoUtils.decrypt(suid);
    } else {
      storeId = await this.getStoreId({ alias });
    }

    if (!storeId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'store identifier 2 is not defined',
        },
        response: { language: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.languageCacheStore.getLanguage(storeId)) as {
      language: Language | null;
    };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, storeId);

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
      if (language && storeId) {
        this.languageCacheStore.setLanguage({
          storeId,
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
