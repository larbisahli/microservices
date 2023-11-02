// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  CategoryProductsRequest as _productPackage_CategoryProductsRequest,
  CategoryProductsRequest__Output as _productPackage_CategoryProductsRequest__Output,
} from '../productPackage/CategoryProductsRequest';
import type {
  PopularProductsRequest as _productPackage_PopularProductsRequest,
  PopularProductsRequest__Output as _productPackage_PopularProductsRequest__Output,
} from '../productPackage/PopularProductsRequest';
import type {
  ProductRequest as _productPackage_ProductRequest,
  ProductRequest__Output as _productPackage_ProductRequest__Output,
} from '../productPackage/ProductRequest';
import type {
  ProductResponse as _productPackage_ProductResponse,
  ProductResponse__Output as _productPackage_ProductResponse__Output,
} from '../productPackage/ProductResponse';
import type {
  ProductsResponse as _productPackage_ProductsResponse,
  ProductsResponse__Output as _productPackage_ProductsResponse__Output,
} from '../productPackage/ProductsResponse';

export interface ProductServiceRoutesClient extends grpc.Client {
  getCategoryProducts(
    argument: _productPackage_CategoryProductsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoryProducts(
    argument: _productPackage_CategoryProductsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoryProducts(
    argument: _productPackage_CategoryProductsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoryProducts(
    argument: _productPackage_CategoryProductsRequest,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoryProducts(
    argument: _productPackage_CategoryProductsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoryProducts(
    argument: _productPackage_CategoryProductsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoryProducts(
    argument: _productPackage_CategoryProductsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoryProducts(
    argument: _productPackage_CategoryProductsRequest,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;

  getPopularProducts(
    argument: _productPackage_PopularProductsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPopularProducts(
    argument: _productPackage_PopularProductsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPopularProducts(
    argument: _productPackage_PopularProductsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPopularProducts(
    argument: _productPackage_PopularProductsRequest,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPopularProducts(
    argument: _productPackage_PopularProductsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPopularProducts(
    argument: _productPackage_PopularProductsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPopularProducts(
    argument: _productPackage_PopularProductsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPopularProducts(
    argument: _productPackage_PopularProductsRequest,
    callback: grpc.requestCallback<_productPackage_ProductsResponse__Output>
  ): grpc.ClientUnaryCall;

  getProduct(
    argument: _productPackage_ProductRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _productPackage_ProductRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_productPackage_ProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _productPackage_ProductRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _productPackage_ProductRequest,
    callback: grpc.requestCallback<_productPackage_ProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _productPackage_ProductRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _productPackage_ProductRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_productPackage_ProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _productPackage_ProductRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_productPackage_ProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _productPackage_ProductRequest,
    callback: grpc.requestCallback<_productPackage_ProductResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface ProductServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getCategoryProducts: grpc.handleUnaryCall<
    _productPackage_CategoryProductsRequest__Output,
    _productPackage_ProductsResponse
  >;

  getPopularProducts: grpc.handleUnaryCall<
    _productPackage_PopularProductsRequest__Output,
    _productPackage_ProductsResponse
  >;

  getProduct: grpc.handleUnaryCall<
    _productPackage_ProductRequest__Output,
    _productPackage_ProductResponse
  >;
}

export interface ProductServiceRoutesDefinition extends grpc.ServiceDefinition {
  getCategoryProducts: MethodDefinition<
    _productPackage_CategoryProductsRequest,
    _productPackage_ProductsResponse,
    _productPackage_CategoryProductsRequest__Output,
    _productPackage_ProductsResponse__Output
  >;
  getPopularProducts: MethodDefinition<
    _productPackage_PopularProductsRequest,
    _productPackage_ProductsResponse,
    _productPackage_PopularProductsRequest__Output,
    _productPackage_ProductsResponse__Output
  >;
  getProduct: MethodDefinition<
    _productPackage_ProductRequest,
    _productPackage_ProductResponse,
    _productPackage_ProductRequest__Output,
    _productPackage_ProductResponse__Output
  >;
}
