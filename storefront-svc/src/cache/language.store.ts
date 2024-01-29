import { Logger } from '@core';
import { Service } from 'typedi';
import { isEmpty } from 'underscore';
import crypto from 'crypto';
import LanguageCache from './models/language';
import byteSize from 'byte-size';
import LanguagePackage from './packages/language.package';
import { Language } from '@proto/generated/language/Language';

@Service()
export class LanguageCacheStore {
  constructor(protected languagePackage: LanguagePackage) {}

  private getId = (storeId: string) => {
    return crypto.createHash('sha256').update(storeId).digest('hex');
  };

  public getLanguage = async (storeId: string) => {
    try {
      const resource = await LanguageCache.findOne({
        key: { $eq: this.getId(storeId) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.languagePackage.decode(resource?.data!))?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getLanguage >>', { error });
      throw error;
    }
  };

  public setLanguage = async ({
    storeId,
    resource,
  }: {
    storeId: string;
    resource: Language;
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.languagePackage.encode(resource);

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

      const respond = await LanguageCache.create({
        key: this.getId(storeId),
        data: buffer,
        storeId,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setLanguage >>', { error });
    }
  };

  public invalidateLanguageCache = async (storeId: string) => {
    try {
      const respond = await LanguageCache.deleteOne({
        key: { $eq: this.getId(storeId) },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('invalidateLanguageCache >>', { error });
    }
  };
}
