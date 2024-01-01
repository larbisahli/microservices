import { Logger } from '@core';
import { Service } from 'typedi';
import { ProductPackage } from './packages';
import { isEmpty } from 'underscore';
import crypto from 'crypto';
import ProductCache from './models/product';
import byteSize from 'byte-size';

@Service()
export class ProductCacheStore {
  constructor(protected productPackage: ProductPackage) {}

  private getBySlug = ({ alias, slug }: { alias: string; slug: string }) => {
    return crypto.createHash('sha256').update(`${alias}:${slug}`).digest('hex');
  };

  public getProductById = async ({ id }: { id: number }) => {
    try {
      const resource = await ProductCache.findOne({
        key: { $eq: id },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.productPackage.decodeProduct(resource?.data!))
        ?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getProductById >>', { error });
      throw error;
    }
  };

  public getProductBySlug = async ({
    alias,
    slug,
  }: {
    alias: string;
    slug: string;
  }) => {
    try {
      const resource = await ProductCache.findOne({
        slug: { $eq: this.getBySlug({ alias, slug }) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.productPackage.decodeProduct(resource?.data!))
        ?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getProductBySlug >>', { error });
      throw error;
    }
  };

  public setProduct = async ({
    store,
    id,
    slug,
    resource,
  }: {
    store: { alias: string; storeId: string };
    id: number;
    slug: string;
    resource: any;
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.productPackage.encodeProduct(
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

      const respond = await ProductCache.create({
        key: id,
        slug: this.getBySlug({ alias, slug }),
        alias,
        storeId,
        data: buffer,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setProduct >>', { error });
    }
  };

  public invalidateProductCache = async ({ id }: { id: number }) => {
    try {
      const respond = await ProductCache.deleteOne({
        key: { $eq: id },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('invalidateProductCache >>', { error });
    }
  };
}
