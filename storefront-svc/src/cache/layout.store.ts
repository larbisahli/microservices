import { Logger } from '@core';
import { Service } from 'typedi';
import { isEmpty } from 'underscore';
import crypto from 'crypto';
import LayoutCache from './models/layout';
import byteSize from 'byte-size';
import LayoutPackage from './packages/layout.package';
import { Layout } from '@proto/generated/layout/Layout';

@Service()
export class LayoutCacheStore {
  constructor(protected layoutPackage: LayoutPackage) {}

  private getId = (storeId: string, page: string, storeLanguageId: number) => {
    return crypto
      .createHash('sha256')
      .update(storeId + page + storeLanguageId)
      .digest('hex');
  };

  public getPageLayout = async (
    storeId: string,
    page: string,
    storeLanguageId: number
  ) => {
    try {
      const resource = await LayoutCache.findOne({
        key: { $eq: this.getId(storeId, page, storeLanguageId) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.layoutPackage.decode(resource?.data!))?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getPageLayout >>', { error });
      throw error;
    }
  };

  public setPageLayout = async ({
    storeId,
    page,
    storeLanguageId,
    localeId,
    resource,
  }: {
    storeId: string;
    page: string;
    storeLanguageId: number;
    localeId: string;
    resource: Layout;
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.layoutPackage.encode(resource);

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

      const respond = await LayoutCache.create({
        key: this.getId(storeId, page, storeLanguageId),
        data: buffer,
        page,
        storeId,
        localeId,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setPageLayout >>', { error });
    }
  };

  public invalidatePageLayoutCache = async (storeId: string, page: string) => {
    try {
      // delete by storeId and page
      const respond = await LayoutCache.deleteOne({
        key: { $eq: 'this.getId(storeId, page)' },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('invalidatePageLayoutCache >>', { error });
    }
  };
}
