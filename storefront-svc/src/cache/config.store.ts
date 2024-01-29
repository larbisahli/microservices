import { Logger } from '@core';
import { Service } from 'typedi';
import { ConfigPackage } from './packages';
import { isEmpty } from 'underscore';
import crypto from 'crypto';
import ConfigCache from './models/config';
import byteSize from 'byte-size';
import { Settings__Output } from '@proto/generated/settings/Settings';

@Service()
export class ConfigCacheStore {
  constructor(protected configPackage: ConfigPackage) {}

  private getId = (storeId: string) => {
    return crypto.createHash('sha256').update(storeId).digest('hex');
  };

  public getConfig = async (storeId: string) => {
    try {
      const resource = await ConfigCache.findOne({
        key: { $eq: this.getId(storeId) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.configPackage.decode(resource?.data!))?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getConfig >>', { error });
      throw error;
    }
  };

  public setConfig = async ({
    storeId,
    resource,
  }: {
    storeId: string;
    resource: Settings__Output;
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.configPackage.encode(resource);

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

      const respond = await ConfigCache.create({
        key: this.getId(storeId),
        data: buffer,
        storeId,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setConfig >>', { error });
    }
  };

  public invalidateConfigCache = async (storeId: string) => {
    try {
      const respond = await ConfigCache.deleteOne({
        key: { $eq: this.getId(storeId) },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('invalidateConfigCache >>', { error });
    }
  };
}
