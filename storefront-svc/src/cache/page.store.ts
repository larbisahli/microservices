import { Logger } from '@core';
import { Service } from 'typedi';
import { PagePackage } from './packages';
import { isEmpty } from 'underscore';
import crypto from 'crypto';
import PageCache from './models/page';
import byteSize from 'byte-size';
import { Page } from '@proto/generated/page/Page';

@Service()
export class PageCacheStore {
  constructor(protected pagePackage: PagePackage) {}

  private getId = ({ storeId, key }: { storeId: string; key: string }) => {
    return crypto
      .createHash('sha256')
      .update(`${storeId}:${key}`)
      .digest('hex');
  };

  public getPage = async ({
    storeId,
    key,
  }: {
    storeId: string;
    key: string;
  }) => {
    try {
      const resource = await PageCache.findOne({
        key: { $eq: this.getId({ storeId, key }) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.pagePackage.decode(resource?.data!))?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getPage >>', { error });
      throw error;
    }
  };

  public setPage = async ({
    storeId,
    key,
    resource,
  }: {
    storeId: string;
    key: string;
    resource: Page;
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.pagePackage.encode(resource);

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

      const respond = await PageCache.create({
        key: this.getId({ storeId, key }),
        data: buffer,
        slug: key,
        storeId,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setPage >>', { error });
    }
  };

  public invalidatePageCache = async ({
    storeId,
    key,
  }: {
    storeId: string;
    key: string;
  }) => {
    try {
      const respond = await PageCache.deleteOne({
        key: { $eq: this.getId({ storeId, key }) },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('invalidatePageCache >>', { error });
    }
  };
}
