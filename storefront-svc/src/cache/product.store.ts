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

  private getBySlug = ({
    storeId,
    slug,
  }: {
    storeId: string;
    slug: string;
  }) => {
    return crypto
      .createHash('sha256')
      .update(`${storeId}:${slug}`)
      .digest('hex');
  };

  public getProductById = async (id: number) => {
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
    storeId,
    slug,
  }: {
    storeId: string;
    slug: string;
  }) => {
    try {
      const resource = await ProductCache.findOne({
        slug: { $eq: this.getBySlug({ storeId, slug }) },
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
    storeId,
    id,
    slug,
    resource,
  }: {
    storeId: string;
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

      const respond = await ProductCache.create({
        key: id,
        slug: this.getBySlug({ storeId, slug }),
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
