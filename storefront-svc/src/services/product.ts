import { ServerErrorResponse, StatusObject } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { Service } from 'typedi';
import { ProductRpcService } from '@gRPC/client/services';
import { ResourceHandler } from '@cache/resource.store';
import { Product__Output } from '@proto/generated/productPackage/Product';
import { PopularProductsRequest } from '@proto/generated/productPackage/PopularProductsRequest';
import { ProductRequest } from '@proto/generated/productPackage/ProductRequest';
import { ProductResponse } from '@proto/generated/productPackage/ProductResponse';
import { CategoryProductsRequest } from '@proto/generated/productPackage/CategoryProductsRequest';
import { ProductsResponse } from '@proto/generated/productPackage/ProductsResponse';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class ProductHandler {
  /**
   * @param {ProductRpcService} productRpcService
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected productRpcService: ProductRpcService,
    protected resourceHandler: ResourceHandler
  ) {}

  /**
   * @param { ServerUnaryCall<PopularProductsRequest, ProductsResponse>} call
   * @returns {Promise<Product__Output[]>}
   */
  public getPopularProducts = async (
    call: grpc.ServerUnaryCall<PopularProductsRequest, ProductsResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { products: Product__Output[] | null };
  }> => {
    const { alias } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.UNKNOWN,
          details: 'Unknown error',
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

    /** Remote procedure call to get popular products from the business server */
    const response = await this.productRpcService.getPopular(alias);

    const { products = [], error } = response;

    /** Set the resources in the cache store */
    if (products && alias) {
      this.resourceHandler.setResource({
        alias,
        resource: products,
        resourceName: 'popularProducts',
        packageName: 'products',
      });
    }

    return { error, response: { products } };
  };

  /**
   * @param { ServerUnaryCall<PopularProductsRequest, ProductsResponse>} call
   * @returns {Promise<Product__Output[]>}
   */
  public getCategoryProducts = async (
    call: grpc.ServerUnaryCall<CategoryProductsRequest, ProductsResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { products: Product__Output[] | null };
  }> => {
    const { alias, urlKey, page = 0 } = call.request;

    if (!alias || !urlKey) {
      return {
        error: {
          code: Status.UNKNOWN,
          details: 'Unknown error',
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

    /** Remote procedure call to get category products from the business server */
    const response = await this.productRpcService.getStoreCategoryProducts(
      alias,
      urlKey,
      page
    );

    const { products = [], error } = response;

    /** Set the resources in the cache store */
    if (products && alias) {
      this.resourceHandler.setResource({
        alias,
        resource: products,
        resourceName: urlKey,
        packageName: 'products',
        page,
      });
    }

    return { error, response: { products } };
  };

  /**
   * @param { ServerUnaryCall<ProductRequest, ProductResponse>} call
   * @returns {Promise<Product__Output>}
   */
  public getProduct = async (
    call: grpc.ServerUnaryCall<ProductRequest, ProductResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { product: Product__Output | null };
  }> => {
    const { alias, slug } = call.request;

    if (!alias || !slug) {
      return {
        error: {
          code: Status.UNKNOWN,
          details: 'Unknown error',
        },
        response: { product: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: slug,
      packageName: 'product',
    })) as { product: Product__Output | null };

    if (resource) {
      return { error: null, response: resource };
    }

    /** Remote procedure call to get popular products from the business server */
    const response = await this.productRpcService.getStoreProduct(alias, slug);

    const { product = null, error } = response;

    /** Set the resources in the cache store */
    if (product && alias) {
      this.resourceHandler.setResource({
        alias,
        resourceName: slug,
        resource: product,
        packageName: 'product',
      });
    }

    return { error, response: { product: product } };
  };
}
