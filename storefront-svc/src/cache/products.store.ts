import { Logger } from '@core';
import { Service } from 'typedi';
import { ProductPackage } from './packages';
import { isEmpty } from 'underscore';
import crypto from 'crypto';
import ProductsCache from './models/products';
import byteSize from 'byte-size';
import { ResourceNamesType } from '@ts-types/index';

@Service()
export class ProductsCacheStore {
  constructor(protected productPackage: ProductPackage) {}

  private getId = ({
    storeId,
    key,
    page = null,
  }: {
    storeId: string;
    key: string;
    page?: number | null;
  }) => {
    if (page) {
      return crypto
        .createHash('sha256')
        .update(`${storeId}:${key}:${page}`)
        .digest('hex');
    } else {
      return crypto
        .createHash('sha256')
        .update(`${storeId}:${key}`)
        .digest('hex');
    }
  };

  public getProducts = async ({
    storeId,
    key,
    page = null,
  }: {
    storeId: string;
    key: ResourceNamesType | string;
    page?: number | null;
  }) => {
    try {
      const resource = await ProductsCache.findOne({
        key: { $eq: this.getId({ storeId, key, page }) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.productPackage.decodeProducts(resource?.data!))
        ?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getProducts >>', { error });
      throw error;
    }
  };

  public setProducts = async ({
    storeId,
    key,
    resource,
    page = null,
  }: {
    storeId: string;
    key: ResourceNamesType | string;
    resource: any;
    page?: number | null;
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.productPackage.encodeProducts(
        resource
      );

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

      const respond = await ProductsCache.create({
        key: this.getId({ storeId, key, page }),
        data: buffer,
        storeId,
        page,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setProducts >>', { error });
    }
  };

  public InvalidateProductsCache = async ({ storeId }: { storeId: string }) => {
    try {
      const respond = await ProductsCache.deleteMany({
        storeId: { $eq: storeId },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('InvalidateProductsCache >>', { error });
    }
  };
}
