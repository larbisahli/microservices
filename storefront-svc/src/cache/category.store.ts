import { Logger } from '@core';
import { Service } from 'typedi';
import { CategoryPackage } from './packages';
import { isEmpty } from 'underscore';
import crypto from 'crypto';
import CategoryCache from './models/category';
import byteSize from 'byte-size';
import { ResourceNamesEnum, ResourceNamesType } from '@ts-types/index';

@Service()
export class CategoryCacheStore {
  packages: {
    [key: string]: {
      encode: (
        resource: any
      ) => Promise<{ buffer: Uint8Array; error?: unknown }>;
      decode: (
        buffer: protobuf.Buffer
      ) => Promise<{ resource: any; error?: unknown }>;
    };
  };

  constructor(protected categoryPackage: CategoryPackage) {
    this.packages = {
      [ResourceNamesEnum.MENU]: {
        encode: this.categoryPackage.encodeMenu,
        decode: this.categoryPackage.decodeMenu,
      },
      [ResourceNamesEnum.CATEGORY]: {
        encode: this.categoryPackage.encodeCategory,
        decode: this.categoryPackage.decodeCategory,
      },
      [ResourceNamesEnum.HOMEPAGE_CATEGORIES]: {
        encode: this.categoryPackage.encodeHomepageCategories,
        decode: this.categoryPackage.decodeHomepageCategories,
      },
    };
  }

  private getId = ({
    storeId,
    key,
  }: {
    storeId: string;
    key: ResourceNamesType | string;
  }) => {
    return crypto
      .createHash('sha256')
      .update(`${storeId}:${key}`)
      .digest('hex');
  };

  public getResource = async ({
    storeId,
    packageName,
    key,
  }: {
    storeId: string;
    packageName: ResourceNamesType;
    key: ResourceNamesType | string;
  }) => {
    try {
      const resource = await CategoryCache.findOne({
        key: { $eq: this.getId({ storeId, key }) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.packages[packageName].decode(resource?.data!))
        ?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('category-getResource >>', { error });
      throw error;
    }
  };

  public setResource = async ({
    storeId,
    packageName,
    key,
    resource,
  }: {
    storeId: string;
    packageName: ResourceNamesType;
    key: ResourceNamesType | string;
    resource: any;
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.packages[packageName].encode(
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

      const respond = await CategoryCache.create({
        key: this.getId({ storeId, key }),
        data: buffer,
        name: key,
        storeId,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('category-setResource >>', { error });
    }
  };

  public invalidateResourceCache = async ({
    storeId,
    key,
  }: {
    storeId: string;
    key: ResourceNamesType;
  }) => {
    try {
      const respond = await CategoryCache.deleteOne({
        key: { $eq: this.getId({ storeId, key }) },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('category-invalidateResourceCache >>', { error });
    }
  };
}
