import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { Shipping } from '@proto/generated/shipping/Shipping';
import { ShippingRequest } from '@proto/generated/shipping/ShippingRequest';
import { ShippingResponse } from '@proto/generated/shipping/ShippingResponse';
import { Status } from '@grpc/grpc-js/build/src/constants';
import ShippingRepository from '@repository/shipping.repository';
import PostgresClient from '@database';
import { CryptoUtils } from '@core';

@Service()
export default class ShippingHandler extends PostgresClient {
  /**
   * @param {ShippingRepository} shippingRepository
   */
  constructor(
    protected shippingRepository: ShippingRepository,
    protected cryptoUtils: CryptoUtils
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<MenuRequest__Output, MenuResponse>} call
   * @returns {Promise<{shippings: Shipping}>}
   */
  public getShippings = async (
    call: ServerUnaryCall<ShippingRequest, ShippingResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { shippings: Shipping[] | [] };
  }> => {
    const { alias, suid } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { shippings: [] },
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
        response: { shippings: [] },
      };
    }

    try {
      /** Check if resource is in the cache store */
      const { shippings, error } = await this.shippingRepository.getShippings(
        storeId
      );

      if (error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: error.message,
          },
          response: { shippings: [] },
        };
      }

      return { response: { shippings }, error: null };
    } catch (error: any) {
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { shippings: [] },
      };
    }
  };
}
