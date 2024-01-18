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

@Service()
export default class ShippingHandler {
  /**
   * @param {ShippingRepository} shippingRepository
   */
  constructor(protected shippingRepository: ShippingRepository) {}

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
    const { alias, storeId } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { shippings: [] },
      };
    }

    try {
      /** Check if resource is in the cache store */
      const { shippings, error } = await this.shippingRepository.getShippings({
        alias,
        storeId,
      });

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
