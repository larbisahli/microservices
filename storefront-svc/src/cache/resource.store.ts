import { Logger } from '@core';
import { Service } from 'typedi';
import CacheStore from './store';
import { Binary } from 'mongodb';
import {
  CategoryPackage,
  ConfigPackage,
  PagePackage,
  ProductPackage,
  SlidePackage,
} from './packages';
import { MongoDBConfig } from '@config';
import { isEmpty } from 'underscore';
import crypto from 'crypto';

@Service()
export class ResourceHandler extends CacheStore {
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

  constructor(
    protected productPackage: ProductPackage,
    protected categoryPackage: CategoryPackage,
    protected slidePackage: SlidePackage,
    protected configPackage: ConfigPackage,
    protected pagePackage: PagePackage
  ) {
    super({
      mongoUrl: MongoDBConfig.url,
      dbName: 'store-cache',
      // * (in seconds) Note: If the store doesn't make any request within 5h we will automatically prune the store cache
      ttl: 5 * 60 * 60,
    });

    this.packages = {
      menu: {
        encode: this.categoryPackage.encodeMenu,
        decode: this.categoryPackage.decodeMenu,
      },
      category: {
        encode: this.categoryPackage.encodeCategory,
        decode: this.categoryPackage.decodeCategory,
      },
      heroSlide: {
        encode: this.slidePackage.encodeHeroBanner,
        decode: this.slidePackage.decodeHeroBanner,
      },
      promoSlide: {
        encode: this.slidePackage.encodePromoBanner,
        decode: this.slidePackage.decodePromoBanner,
      },
      products: {
        encode: this.productPackage.encodeProducts,
        decode: this.productPackage.decodeProducts,
      },
      product: {
        encode: this.productPackage.encodeProduct,
        decode: this.productPackage.decodeProduct,
      },
      storeConfig: {
        encode: this.configPackage.encodeConfig,
        decode: this.configPackage.decodeConfig,
      },
      page: {
        encode: this.pagePackage.encodePage,
        decode: this.pagePackage.decodePage,
      },
    };
  }

  private getId = ({
    packageName,
    resourceName,
    page = null,
  }: {
    packageName: string;
    resourceName: string;
    page?: number | null;
  }) => {
    if (page) {
      return crypto
        .createHash('sha256')
        .update(`${packageName}:${resourceName}:${page}`)
        .digest('hex');
    } else {
      return crypto
        .createHash('sha256')
        .update(`${packageName}:${resourceName}`)
        .digest('hex');
    }
  };

  public getResource = async ({
    alias,
    resourceName,
    packageName,
    page = null,
  }: {
    alias: string;
    resourceName: string;
    packageName: string;
    page?: number | null;
  }) => {
    try {
      const resource = await this.get(
        alias,
        this.getId({ packageName, resourceName, page })
      );

      if (!(resource && resource?.buffer instanceof Binary)) {
        return null;
      }

      const oneHourInMs = 60 * 60 * 1000;

      // Extend document expiry date if the document was accessed within 1h left to expiry
      if (
        oneHourInMs >
        Number(resource.expires?.getTime()) - new Date(Date.now()).getTime()
      ) {
        await this.extendExpiryDate(alias, resourceName);
      }

      /**
       * Convert the data back from a BSON Binary object to a Node.js Buffer
       */
      const buffer = Buffer.from(resource.buffer.buffer);

      return (await this.packages[packageName].decode(buffer))?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getResource >>', { error });
      throw error;
    }
  };

  public setResource = async ({
    alias,
    resourceName,
    resource,
    packageName,
    page = null,
  }: {
    alias: string;
    resourceName: string;
    packageName: string;
    resource: any;
    page?: number | null;
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

      const respond = await this.set(alias, {
        _id: this.getId({ packageName, resourceName, page }),
        buffer,
        packageName,
        resourceName,
        page,
      })
        .then(() => true)
        .catch((error) => {
          console.log({ error });
          return false;
        });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setResource >>', { error });
    }
  };

  public deleteResource = async ({
    alias,
    resourceName,
    packageName,
  }: {
    alias: string;
    resourceName: string;
    packageName: string;
  }) => {
    try {
      return await this.destroy(
        alias,
        this.getId({ packageName, resourceName })
      )
        .then(() => true)
        .catch((error) => {
          console.log({ error });
          return false;
        });
    } catch (error) {
      Logger.system.error(error);
      console.log('setResource >>', { error });
    }
  };
}
