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

interface ProductInterface extends Product__Output {
  maxComparePrice: number;
  minComparePrice: number;
  maxPrice: number;
  minPrice: number;
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
    protected productCacheStore: ProductCacheStore
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
    const { getStorTaxRate, getStoreSystemCurrency } = this.settingsQueries;
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

      const { rows: taxRateRows } = await client.query<{ rate: number }>(
        getStorTaxRate()
      );
      const { rows: systemCurrencyRows } = await client.query<{
        systemCurrency: CurrencyType;
      }>(getStoreSystemCurrency());

      const { rate } = taxRateRows[0] ?? {};
      const { systemCurrency } = systemCurrencyRows[0] ?? {};

      const { rows } = await client.query<ProductInterface>(
        getPopularProducts(storeLanguageId)
      );

      const products = rows?.map((product) => {
        return {
          ...product,
          ...calcPriceRange(product, systemCurrency, rate),
        };
      });

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
   * @returns {Promise<Product__Output[]>}
   */
  public getCategoryProducts = async (
    call: ServerUnaryCall<CategoryProductsRequest, ProductsResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { products: Product__Output[] | null };
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

      const { rows } = await client.query<Product__Output>(
        getCategoryProducts(
          categoryId,
          storeLanguageId,
          limit,
          offset(page, limit)
        )
      );

      const products = rows;

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
   * @returns {Promise<Product__Output>}
   */
  public getProduct = async (
    call: ServerUnaryCall<ProductRequest, ProductResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { product: Product__Output | ProductType | null };
  }> => {
    const {
      getProductTranslation,
      getProductGallery,
      getProductContent,
      getProductShippingInfo,
      getStoreProductCategories,
      getProductTags,
      getProductVariationOptions,
      getProductVariationForStore,
      getStoreProductRelatedProducts,
      getStoreProductUpsellProducts,
    } = this.productQueries;

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

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          response: { product: null },
        };
      }

      // ProductContent
      const { rows: productContent } = await client.query<ProductType>(
        getProductContent(slug)
      );

      const content = productContent[0] ?? {};

      const { id: productId } = content;

      // Translation
      const { rows: productTranslationRows } =
        await client.query<ProductTranslationType>(
          getProductTranslation(productId, storeLanguageId)
        );

      const productTranslation = productTranslationRows[0] ?? {};

      // Thumbnail
      const { rows: thumbnail } = await client.query<ImageType>(
        getProductGallery(productId, true)
      );

      // Gallery
      const { rows: gallery } = await client.query<ImageType>(
        getProductGallery(productId, false)
      );

      // ProductShippingInfo
      const { rows: productShippingInfoRows } =
        await client.query<ProductShippingInfo>(
          getProductShippingInfo(productId)
        );

      const productShippingInfo = productShippingInfoRows[0];

      // ProductCategory
      const { rows: categories } = await client.query<CategoryType>(
        getStoreProductCategories(productId, storeLanguageId)
      );

      // ProductTag
      const { rows: tags } = await client.query<TagType>(
        getProductTags(productId, storeLanguageId)
      );

      // variationOptions
      const { rows: variationOptions } =
        await client.query<ProductVariationOptions>(
          getProductVariationOptions(productId)
        );

      // variations
      const { rows: variations } = await client.query<VariationType>(
        getProductVariationForStore(productId, storeLanguageId)
      );

      // relatedProducts
      const { rows: relatedProducts } = await client.query<ProductInterface>(
        getStoreProductRelatedProducts(productId, storeLanguageId)
      );

      // upsellProducts
      const { rows: upsellProducts } = await client.query<ProductInterface>(
        getStoreProductUpsellProducts(productId, storeLanguageId)
      );

      // crossSellProducts
      const { rows: crossSellProducts } = await client.query<ProductInterface>(
        getStoreProductUpsellProducts(productId, storeLanguageId)
      );

      const product = {
        ...content,
        name: productTranslation?.name,
        description: productTranslation?.description,
        thumbnail,
        gallery,
        categories,
        tags,
        variationOptions,
        variations,
        productSeo: {
          slug: content.slug,
          metaImage: content?.metaImage,
          ...productTranslation,
        },
        productShippingInfo,
        relatedProducts,
        upsellProducts,
        crossSellProducts,
      };

      /** Set the resources in the cache store */
      if (product && alias) {
        this.productCacheStore.setProduct({
          store,
          id: productId,
          slug,
          resource: product,
        });
      }

      await client.query('COMMIT');

      return {
        // @ts-ignore
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
