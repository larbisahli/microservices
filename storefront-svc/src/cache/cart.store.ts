import { Service } from 'typedi';
import { isEmpty } from 'underscore';
import CartCache from './models/cart';
import { CartPackage } from './packages/cart.package';
import { Logger } from '@core';

@Service()
export class CartCacheStore {
  constructor(protected cartPackage: CartPackage) {}

  public getClientCart = async ({ cartId }: { cartId: string }) => {
    try {
      const resource = await CartCache.findOne({
        key: { $eq: cartId },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      const cart = await this.cartPackage.decode(resource?.data!);
      return { cart };
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getClientCart >>', { error });
      throw error;
    }
  };
}
