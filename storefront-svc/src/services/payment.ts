import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { StipePaymentRequest } from '@proto/generated/payment/StipePaymentRequest';
import { StipePaymentResponse } from '@proto/generated/payment/StipePaymentResponse';
import { Stripe as StripeRpcType } from '@proto/generated/payment/Stripe';
import { CryptoUtils } from '@core';

@Service()
export default class ConfigHandler extends PostgresClient {
  /**
   * @param {SettingsQueries} settingsQueries
   */
  constructor(protected cryptoUtils: CryptoUtils) {
    super();
  }

  /**
   * @param { ServerUnaryCall<StipePaymentRequest, StipePaymentResponse>} call
   * @returns {Promise<Settings__Output>}
   */
  public getStripeClientSecret = async (
    call: ServerUnaryCall<StipePaymentRequest, StipePaymentResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { results: StripeRpcType | null };
  }> => {
    const { alias, suid } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { results: null },
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
          details: 'store identifier is not defined',
        },
        response: { results: null },
      };
    }

    try {
      return { response: { results: {} }, error: null };
    } catch (error: any) {
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { results: null },
      };
    }
  };
}
