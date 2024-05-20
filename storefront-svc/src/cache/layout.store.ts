import { Logger } from '@core';
import { Service } from 'typedi';
import { isEmpty } from 'underscore';
import crypto from 'crypto';
import LayoutCache from './models/layout';
import CommonLayoutCache from './models/common-layout';
import byteSize from 'byte-size';
import LayoutPackage from './packages/layout.package';
import { Layout } from '@proto/generated/layout/Layout';
import { PageLayoutBlocks } from '@ts-types/enums';
import { StoreLayoutComponentType } from '@ts-types/interfaces';

@Service()
export class LayoutCacheStore {
  constructor(protected layoutPackage: LayoutPackage) {}

  private getId = (
    storeId: string,
    templateId: string,
    storeLanguageId: number,
    page?: string | null
  ) => {
    return crypto
      .createHash('sha256')
      .update(storeId + templateId + storeLanguageId + page ?? '')
      .digest('hex');
  };

  public getPageLayout = async (
    storeId: string,
    templateId: string,
    storeLanguageId: number,
    page: string | null,
    isCommon?: boolean
  ) => {
    try {
      let resource;
      if (isCommon) {
        resource = await CommonLayoutCache.findOne({
          key: { $eq: this.getId(storeId, templateId, storeLanguageId) },
        });
      } else {
        resource = await LayoutCache.findOne({
          key: { $eq: this.getId(storeId, templateId, storeLanguageId, page) },
        });
      }

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

  public getCommonLayout = async (
    storeId: string,
    templateId: string,
    storeLanguageId: number
  ) => {
    try {
      const resource = await LayoutCache.findOne({
        key: { $eq: this.getId(storeId, templateId, storeLanguageId) },
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
    templateId,
    page,
    storeLanguageId,
    localeId,
    resource,
    isCommon = false,
  }: {
    storeId: string;
    templateId: string;
    storeLanguageId: number;
    localeId: string;
    resource: Layout | { [PageLayoutBlocks.Main]: StoreLayoutComponentType[] };
    isCommon: boolean;
    page?: string;
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

      if (isCommon) {
        const respondCommon = await CommonLayoutCache.create({
          key: this.getId(storeId, templateId, storeLanguageId),
          data: buffer,
          templateId,
          storeId,
          localeId,
          size: `${value}${unit}`,
        });
        return respondCommon;
      }

      const respond = await LayoutCache.create({
        key: this.getId(storeId, templateId, storeLanguageId, page),
        data: buffer,
        page,
        templateId,
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
