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

  private getId = (storeId: string) => {
    return crypto.createHash('sha256').update(storeId).digest('hex');
  };

  public getShippings = async (storeId: string) => {
    try {
      const resource = await ShippingCache.findOne({
        key: { $eq: this.getId(storeId) },
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
    storeId,
    resource,
  }: {
    storeId: string;
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

      const respond = await ShippingCache.create({
        key: this.getId(storeId),
        data: buffer,
        storeId,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setShippings >>', { error });
    }
  };

  public invalidateShippingCache = async (storeId: string) => {
    try {
      const respond = await ShippingCache.deleteOne({
        key: { $eq: this.getId(storeId) },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('invalidateShippingCache >>', { error });
    }
  };
}
