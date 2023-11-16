import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { CategoryQueries, ProductQueries } from '@sql';
import { Product__Output } from '@proto/generated/productPackage/Product';
import { PopularProductsRequest } from '@proto/generated/productPackage/PopularProductsRequest';
import { ProductRequest } from '@proto/generated/productPackage/ProductRequest';
import { ProductResponse } from '@proto/generated/productPackage/ProductResponse';
import {
  CategoryType,
  ImageType,
  ProductSeoType,
  ProductShippingInfo,
  ProductType,
  ProductVariationOptions,
  SuppliersType,
  TagType,
  VariationType,
} from '@ts-types/interfaces';
import { CategoryProductsRequest } from '@proto/generated/productPackage/CategoryProductsRequest';
import { ProductsResponse } from '@proto/generated/productPackage/ProductsResponse';
import { offset } from '@utils/index';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ResourceHandler } from '@cache/resource.store';

@Service()
export default class ProductHandler extends PostgresClient {
  /**
   * @param {ProductQueries} productQueries
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected productQueries: ProductQueries,
    protected categoryQueries: CategoryQueries,
    protected resourceHandler: ResourceHandler
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
    const { alias } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { products: [] },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: 'popularProducts',
      packageName: 'products',
    })) as { products: Product__Output[] | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction(alias);

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          response: { products: [] },
        };
      }

      const { rows } = await client.query<Product__Output>(
        getPopularProducts()
      );

      const products = rows;

      /** Set the resources in the cache store */
      if (products && alias) {
        this.resourceHandler.setResource({
          alias,
          resource: products,
          resourceName: 'popularProducts',
          packageName: 'products',
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

    const { alias, urlKey, page = 0 } = call.request;

    const limit = 5;

    if (!alias || !urlKey) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { products: [] },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: urlKey,
      packageName: 'products',
      page,
    })) as { products: Product__Output[] | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction(alias);

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          response: { products: [] },
        };
      }

      const { rows: category } = await client.query<{ categoryId: number }>(
        getStoreCategoryIdByUrlKey(urlKey)
      );

      const { categoryId } = category[0] ?? {};

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
        getCategoryProducts(categoryId, limit, offset(page, limit))
      );

      const products = rows;

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
      getProductSeoBySlug,
      getProductGallery,
      getProductContent,
      getProductShippingInfo,
      getStoreProductCategories,
      getProductTags,
      getProductSuppliers,
      getProductVariationOptions,
      getProductVariationForStore,
      getStoreProductRelatedProducts,
      getStoreProductUpsellProducts,
    } = this.productQueries;
    const { alias, slug } = call.request;

    if (!alias || !slug) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier or slug are not defined',
        },
        response: { product: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: slug,
      packageName: 'product',
    })) as { product: Product__Output | ProductType | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction(alias);

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          response: { product: null },
        };
      }

      // Seo
      const { rows: productSeoRows } = await client.query<ProductSeoType>(
        getProductSeoBySlug(slug)
      );

      const productSeo = productSeoRows[0] ?? {};

      const id = 1; //productSeo?.productId;

      // Thumbnail
      const { rows: thumbnail } = await client.query<ImageType>(
        getProductGallery(id, true)
      );

      // Gallery
      const { rows: gallery } = await client.query<ImageType>(
        getProductGallery(id, false)
      );

      // ProductContent
      const { rows: productContent } = await client.query<ProductType>(
        getProductContent(id)
      );

      const content = productContent[0] ?? {};

      // ProductShippingInfo
      const { rows: productShippingInfoRows } =
        await client.query<ProductShippingInfo>(getProductShippingInfo(id));

      const productShippingInfo = productShippingInfoRows[0];

      // ProductCategory
      const { rows: categories } = await client.query<CategoryType>(
        getStoreProductCategories(id)
      );

      // ProductTag
      // const { rows: tags } = await client.query<TagType>(getProductTags(id));

      // ProductSupplier
      const { rows: suppliers } = await client.query<SuppliersType>(
        getProductSuppliers(id)
      );

      // variationOptions
      const { rows: variationOptions } =
        await client.query<ProductVariationOptions>(
          getProductVariationOptions(id)
        );

      // variations
      const { rows: variations } = await client.query<VariationType>(
        getProductVariationForStore(id)
      );

      // relatedProducts
      const { rows: relatedProducts } = await client.query<ProductType>(
        getStoreProductRelatedProducts(id)
      );

      // upsellProducts
      const { rows: upsellProducts } = await client.query<ProductType>(
        getStoreProductUpsellProducts(id)
      );

      // crossSellProducts
      const { rows: crossSellProducts } = await client.query<ProductType>(
        getStoreProductUpsellProducts(id)
      );

      const product = {
        ...content,
        thumbnail,
        gallery,
        categories,
        // tags,
        suppliers,
        variationOptions,
        variations,
        productSeo,
        productShippingInfo,
        relatedProducts,
        upsellProducts,
        crossSellProducts,
      };

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
