import { Logger } from '@core';
import { Service } from 'typedi';
import {
  CategoryPackage,
  ConfigPackage,
  PagePackage,
  ProductPackage,
  SlidePackage,
} from './packages';
import { isEmpty } from 'underscore';
import crypto from 'crypto';
import LanguagePackage from './packages/language.package';
import ResourceCache from './models/resource';
import Product from './models/product';
import byteSize from 'byte-size';
import { ResourceNamesEnum, ResourceNamesType } from '@ts-types/index';
import { ProductServiceRoutes } from '@services';

@Service()
export class ResourceHandler {
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
    protected languagePackage: LanguagePackage,
    protected pagePackage: PagePackage
  ) {
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
      [ResourceNamesEnum.HERO_SLIDE]: {
        encode: this.slidePackage.encodeHeroBanner,
        decode: this.slidePackage.decodeHeroBanner,
      },
      [ResourceNamesEnum.PROMO_SLIDE]: {
        encode: this.slidePackage.encodePromoBanner,
        decode: this.slidePackage.decodePromoBanner,
      },
      [ResourceNamesEnum.PRODUCTS]: {
        encode: this.productPackage.encodeProducts,
        decode: this.productPackage.decodeProducts,
      },
      [ResourceNamesEnum.PRODUCT]: {
        encode: this.productPackage.encodeProduct,
        decode: this.productPackage.decodeProduct,
      },
      [ResourceNamesEnum.CONFIG]: {
        encode: this.configPackage.encodeConfig,
        decode: this.configPackage.decodeConfig,
      },
      [ResourceNamesEnum.LANGUAGE]: {
        encode: this.languagePackage.encode,
        decode: this.languagePackage.decode,
      },
      [ResourceNamesEnum.PAGE]: {
        encode: this.pagePackage.encode,
        decode: this.pagePackage.decode,
      },
    };
  }

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

  private getProductId = ({
    storeId,
    productId,
  }: {
    storeId: string;
    productId: number;
  }) => {
    return `${storeId}:${productId}`;
  };

  public getResource = async ({
    alias,
    key,
    name,
    page = null,
  }: {
    alias: string;
    key: string;
    name: ResourceNamesType;
    page?: number | null;
  }) => {
    try {
      const resource = await ResourceCache.findOne({
        key: { $eq: this.getId({ alias, key, page }) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.packages[name].decode(resource?.data!))?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getResource >>', { error });
      throw error;
    }
  };

  public getProduct = async ({
    storeId,
    productId,
    slug,
  }: {
    storeId: string;
    productId: number;
    slug?: string | null;
  }) => {
    try {
      const resource = await ResourceCache.findOne({
        key: { $eq: this.getProductId({ storeId, productId }) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (
        await this.packages[ResourceNamesEnum.PRODUCT].decode(resource?.data!)
      )?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getResource >>', { error });
      throw error;
    }
  };

  public setResource = async ({
    store,
    key,
    name,
    resource,
    page = null,
  }: {
    store: { alias: string; storeId: string };
    key: string;
    name: ResourceNamesType;
    resource: any;
    page?: number | null;
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.packages[name].encode(resource);

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

      // if(name === ResourceNamesEnum.PRODUCT) {
      //   const respond = await Product.create({
      //     key: this.getProductId({ storeId, productId: resource?.id }),
      //     slug: resource?.slug,
      //     data: buffer,
      //     alias,
      //     storeId,
      //     name,
      //     size: `${value}${unit}`,
      //   });
      //   return respond;
      // }

      const respond = await ResourceCache.create({
        key: this.getId({ alias, key, page }),
        data: buffer,
        alias,
        storeId,
        name,
        page,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setResource >>', { error });
    }
  };

  public deleteResource = async ({
    alias,
    key,
    name,
  }: {
    alias: string;
    key: string;
    name: ResourceNamesType;
  }) => {
    try {
      // return await this.db
      //   .destroy(name, this.getId({ alias, key }))
      //   .then(() => true)
      //   .catch((error) => {
      //     console.log({ error });
      //     return false;
      //   });
    } catch (error) {
      Logger.system.error(error);
      console.log('setResource >>', { error });
    }
  };
}
