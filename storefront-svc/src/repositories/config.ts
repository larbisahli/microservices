import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { SettingsQueries } from '@sql';
import { StoreConfigRequest } from '@proto/generated/SettingsPackage/StoreConfigRequest';
import { StoreConfigResponse } from '@proto/generated/SettingsPackage/StoreConfigResponse';
import { Settings__Output } from '@proto/generated/SettingsPackage/Settings';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class ConfigHandler extends PostgresClient {
  /**
   * @param {SettingsQueries} settingsQueries
   */
  constructor(protected settingsQueries: SettingsQueries) {
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
    config: Settings__Output | null;
  }> => {
    const { getStoreSettings } = this.settingsQueries;
    const { alias } = call.request;

    const client = await this.transaction({
      actions: [this.ACTION_PRIVILEGES.READ],
    });

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        config: null,
      };
    }

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          config: null,
        };
      }
      const { rows } = await client.query<Settings__Output>(getStoreSettings());

      await client.query('COMMIT');

      return { config: rows[0], error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        config: null,
      };
    } finally {
      client.release();
    }
  };
}
