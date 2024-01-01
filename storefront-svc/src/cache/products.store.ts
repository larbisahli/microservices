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
    alias,
    key,
    page = null,
  }: {
    alias: string;
    key: string;
    page?: number | null;
  }) => {
    if (page) {
      return crypto
        .createHash('sha256')
        .update(`${alias}:${key}:${page}`)
        .digest('hex');
    } else {
      return crypto
        .createHash('sha256')
        .update(`${alias}:${key}`)
        .digest('hex');
    }
  };

  public getProducts = async ({
    alias,
    key,
    page = null,
  }: {
    alias: string;
    key: ResourceNamesType | string;
    page?: number | null;
  }) => {
    try {
      const resource = await ProductsCache.findOne({
        key: { $eq: this.getId({ alias, key, page }) },
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
    store,
    key,
    resource,
    page = null,
  }: {
    store: { alias: string; storeId: string };
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

      const { alias, storeId } = store;

      const respond = await ProductsCache.create({
        key: this.getId({ alias, key, page }),
        data: buffer,
        alias,
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
