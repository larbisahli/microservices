import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { CategoryQueries, ProductQueries, SettingsQueries } from '@sql';
import {
  CategoryType,
  CurrencyType,
  ImageType,
  ProductShippingInfo,
  ProductTranslationType,
  ProductType,
  ProductVariationOptions,
  TagType,
  VariationType,
} from '@ts-types/interfaces';
import { offset } from '@utils/index';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { PopularProductsRequest } from '@proto/generated/product/PopularProductsRequest';
import { ProductsResponse } from '@proto/generated/product/ProductsResponse';
import { Product__Output } from '@proto/generated/product/Product';
import { CategoryProductsRequest } from '@proto/generated/product/CategoryProductsRequest';
import { ProductRequest } from '@proto/generated/product/ProductRequest';
import { ProductResponse } from '@proto/generated/product/ProductResponse';
import { ResourceNamesEnum } from '@ts-types/index';
import { ProductsCacheStore } from '@cache/products.store';
import { ProductCacheStore } from '@cache/product.store';
import ProductRepository from '@repository/product.repository';

interface ProductInterface extends Product__Output {
  maxComparePrice: number;
  minComparePrice: number;
  maxSalePrice: number;
  minSalePrice: number;
  salePrice: number;
  comparePrice: number;
}

@Service()
export default class ProductHandler extends PostgresClient {
  /**
   * @param {ProductQueries} productQueries
   * @param {SettingsQueries} settingsQueries
   * @param {CategoryQueries} categoryQueries
   * @param {ProductsCacheStore} productsCacheStore
   * @param {ProductCacheStore} productCacheStore
   */
  constructor(
    protected productQueries: ProductQueries,
    protected settingsQueries: SettingsQueries,
    protected categoryQueries: CategoryQueries,
    protected productsCacheStore: ProductsCacheStore,
    protected productCacheStore: ProductCacheStore,
    protected productRepository: ProductRepository
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<PopularProductsRequest, ProductsResponse>} call
   * @returns {Promise<Product__Output[]>}
   */
  public getPopularProducts = async (
    call: ServerUnaryCall<PopularProductsRequest, ProductsResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { products: Product__Output[] | null };
  }> => {
    const { getPopularProducts } = this.productQueries;
    const { alias, storeId, storeLanguageId } = call.request;

    if (!alias || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { products: [] },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.productsCacheStore.getProducts({
      alias,
      key: ResourceNamesEnum.POPULAR_PRODUCTS,
    })) as { products: Product__Output[] | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          response: { products: null },
        };
      }

      const { rows } = await client.query<ProductInterface>(
        getPopularProducts(storeLanguageId)
      );

      const products = rows?.map((product) => ({
        ...product,
        price: {
          maxComparePrice: product?.maxComparePrice,
          minComparePrice: product?.minComparePrice,
          maxSalePrice: product?.maxSalePrice,
          minSalePrice: product?.minSalePrice,
          salePrice: product?.salePrice,
          comparePrice: product?.comparePrice,
        },
      }));

      /** Set the resources in the cache store */
      if (products && alias) {
        this.productsCacheStore.setProducts({
          store,
          key: ResourceNamesEnum.POPULAR_PRODUCTS,
          resource: products,
        });
      }

      await client.query('COMMIT');

      return {
        response: {
          // @ts-ignore
          products,
        },
        error: null,
      };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { products: [] },
      };
    } finally {
      client.release();
    }
  };

  /**
   * @param { ServerUnaryCall<CategoryProductsRequest, ProductsResponse>} call
   * @returns {Promise<ProductInterface[]>}
   */
  public getCategoryProducts = async (
    call: ServerUnaryCall<CategoryProductsRequest, ProductsResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { products: ProductInterface[] | null };
  }> => {
    const { getCategoryProducts } = this.productQueries;
    const { getStoreCategoryIdByUrlKey } = this.categoryQueries;

    const { alias, storeId, storeLanguageId, urlKey, page = 0 } = call.request;

    const limit = 5;

    if (!alias || !urlKey || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { products: [] },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.productsCacheStore.getProducts({
      alias,
      key: urlKey,
      page,
    })) as { products: ProductInterface[] | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          response: { products: null },
        };
      }

      const { rows: category } = await client.query<{ id: number }>(
        getStoreCategoryIdByUrlKey(urlKey)
      );

      const { id: categoryId } = category[0] ?? {};

      if (!categoryId) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: 'Category does not exist',
          },
          response: { products: [] },
        };
      }

      const { rows } = await client.query<ProductInterface>(
        getCategoryProducts(
          categoryId,
          storeLanguageId,
          limit,
          offset(page, limit)
        )
      );

      const products = rows?.map((product) => ({
        ...product,
        price: {
          maxComparePrice: product?.maxComparePrice,
          minComparePrice: product?.minComparePrice,
          maxSalePrice: product?.maxSalePrice,
          minSalePrice: product?.minSalePrice,
          salePrice: product?.salePrice,
          comparePrice: product?.comparePrice,
        },
      }));

      /** Set the resources in the cache store */
      if (products && alias) {
        this.productsCacheStore.setProducts({
          store,
          key: urlKey,
          resource: products,
          page,
        });
      }

      await client.query('COMMIT');

      return { response: { products }, error: null };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { products: [] },
      };
    } finally {
      client.release();
    }
  };

  /**
   * @param { ServerUnaryCall<ProductRequest, ProductResponse>} call
   * @returns {Promise<ProductInterface>}
   */
  public getProduct = async (
    call: ServerUnaryCall<ProductRequest, ProductResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { product: Product__Output | ProductType | null };
  }> => {
    const { getProductIdBySlug } = this.productQueries;

    const { alias, storeId, storeLanguageId, slug } = call.request;

    if (!alias || !slug || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier or slug are not defined',
        },
        response: { product: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.productCacheStore.getProductBySlug({
      alias,
      slug,
    })) as { product: Product__Output | ProductType | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      // TODO use promise.all
      await client.query('BEGIN');

      await this.setupStoreSessions(client, { alias, storeId });

      const { rows: productContent } = await client.query<ProductType>(
        getProductIdBySlug(slug)
      );

      const content = productContent[0] ?? {};

      const { id: productId } = content;

      const { product, error } = await this.productRepository.getProduct({
        id: productId,
        alias,
        storeId,
        storeLanguageId,
      });

      if (error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: error.message,
          },
          response: { product: null },
        };
      }

      await client.query('COMMIT');

      return {
        response: { product },
        error: null,
      };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { product: null },
      };
    } finally {
      client.release();
    }
  };
}
