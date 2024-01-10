import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { CheckoutCacheStore } from '@cache/checkout.store';
import { CheckoutRequest } from '@proto/generated/checkout/CheckoutRequest';
import { CheckoutResponse } from '@proto/generated/checkout/CheckoutResponse';
import { Checkout } from '@proto/generated/checkout/Checkout';
import { isEmpty } from 'underscore';

@Service()
export default class CheckoutHandler {
  /**
   * @param {CheckoutCacheStore} checkoutCacheStore
   */
  constructor(protected checkoutCacheStore: CheckoutCacheStore) {}

  /**
   * @param { ServerUnaryCall<MenuRequest__Output, MenuResponse>} call
   * @returns {Promise<Checkout>}
   */
  public getCheckout = async (
    call: ServerUnaryCall<CheckoutRequest, CheckoutResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { checkout: Checkout | null };
  }> => {
    const { cuid } = call.request;

    if (!cuid) {
      return {
        error: null,
        response: { checkout: null },
      };
    }

    /** Check if resource is in the cache store */
    const checkout = (await this.checkoutCacheStore.getCheckout({
      cuid,
    })) as Checkout | null;

    if (isEmpty(checkout)) {
      return {
        error: null,
        response: { checkout: null },
      };
    }
    return { error: null, response: { checkout } };
  };
}
