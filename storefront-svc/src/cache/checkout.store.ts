import { Logger } from '@core';
import { Service } from 'typedi';
import { isEmpty } from 'underscore';
import { CheckoutPackage } from './packages/checkout.package';
import CheckoutCache from './models/checkout';

@Service()
export class CheckoutCacheStore {
  constructor(protected checkoutPackage: CheckoutPackage) {}

  public getCheckout = async ({ cuid }: { cuid: string }) => {
    try {
      const resource = await CheckoutCache.findOne({
        key: { $eq: cuid },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return await this.checkoutPackage.decode(resource?.data!);
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getCheckout >>', { error });
      throw error;
    }
  };
}
