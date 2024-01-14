import { Logger } from '@core';
import { Service } from 'typedi';
import { isEmpty } from 'underscore';
import ShippingCache from './models/shipping';
import { ShippingPackage } from './packages/shipping.package';
import byteSize from 'byte-size';
import { Shipping } from '@proto/generated/shipping/Shipping';
import crypto from 'crypto';

@Service()
export class ShippingCacheStore {
  constructor(protected shippingPackage: ShippingPackage) {}

  private getId = (alias: string) => {
    return crypto.createHash('sha256').update(alias).digest('hex');
  };

  public getShippings = async (alias: string) => {
    try {
      const resource = await ShippingCache.findOne({
        key: { $eq: this.getId(alias) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.shippingPackage.decode(resource?.data!))?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getShippings >>', { error });
      throw error;
    }
  };

  public setShippings = async ({
    store,
    resource,
  }: {
    store: { alias: string; storeId: string };
    resource: Shipping[];
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.shippingPackage.encode(resource);

      if (error) {
        throw error;
      }

      if (isEmpty(buffer)) {
        return true;
      }

      // Calculate the data size for future inspection (mongodb doc max size is 16MB)
      const { value, unit } = byteSize(buffer?.length, {
        precision: 2,
      });

      const { alias, storeId } = store;

      const respond = await ShippingCache.create({
        key: this.getId(alias),
        data: buffer,
        alias,
        storeId,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setShippings >>', { error });
    }
  };

  public invalidateShippingCache = async (alias: string) => {
    try {
      const respond = await ShippingCache.deleteOne({
        key: { $eq: this.getId(alias) },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('invalidateShippingCache >>', { error });
    }
  };
}
