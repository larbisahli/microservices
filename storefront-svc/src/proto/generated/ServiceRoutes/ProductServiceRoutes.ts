// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CategoryProductsRequest as _product_CategoryProductsRequest, CategoryProductsRequest__Output as _product_CategoryProductsRequest__Output } from '../product/CategoryProductsRequest';
import type { PopularProductsRequest as _product_PopularProductsRequest, PopularProductsRequest__Output as _product_PopularProductsRequest__Output } from '../product/PopularProductsRequest';
import type { ProductRequest as _product_ProductRequest, ProductRequest__Output as _product_ProductRequest__Output } from '../product/ProductRequest';
import type { ProductResponse as _product_ProductResponse, ProductResponse__Output as _product_ProductResponse__Output } from '../product/ProductResponse';
import type { ProductsResponse as _product_ProductsResponse, ProductsResponse__Output as _product_ProductsResponse__Output } from '../product/ProductsResponse';

export interface ProductServiceRoutesClient extends grpc.Client {
  getCategoryProducts(argument: _product_CategoryProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getCategoryProducts(argument: _product_CategoryProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getCategoryProducts(argument: _product_CategoryProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getCategoryProducts(argument: _product_CategoryProductsRequest, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getCategoryProducts(argument: _product_CategoryProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getCategoryProducts(argument: _product_CategoryProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getCategoryProducts(argument: _product_CategoryProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getCategoryProducts(argument: _product_CategoryProductsRequest, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  
  getPopularProducts(argument: _product_PopularProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getPopularProducts(argument: _product_PopularProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getPopularProducts(argument: _product_PopularProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getPopularProducts(argument: _product_PopularProductsRequest, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getPopularProducts(argument: _product_PopularProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getPopularProducts(argument: _product_PopularProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getPopularProducts(argument: _product_PopularProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  getPopularProducts(argument: _product_PopularProductsRequest, callback: grpc.requestCallback<_product_ProductsResponse__Output>): grpc.ClientUnaryCall;
  
  getProduct(argument: _product_ProductRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductResponse__Output>): grpc.ClientUnaryCall;
  getProduct(argument: _product_ProductRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductResponse__Output>): grpc.ClientUnaryCall;
  getProduct(argument: _product_ProductRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductResponse__Output>): grpc.ClientUnaryCall;
  getProduct(argument: _product_ProductRequest, callback: grpc.requestCallback<_product_ProductResponse__Output>): grpc.ClientUnaryCall;
  getProduct(argument: _product_ProductRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductResponse__Output>): grpc.ClientUnaryCall;
  getProduct(argument: _product_ProductRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductResponse__Output>): grpc.ClientUnaryCall;
  getProduct(argument: _product_ProductRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductResponse__Output>): grpc.ClientUnaryCall;
  getProduct(argument: _product_ProductRequest, callback: grpc.requestCallback<_product_ProductResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ProductServiceRoutesHandlers extends grpc.UntypedServiceImplementation {
  getCategoryProducts: grpc.handleUnaryCall<_product_CategoryProductsRequest__Output, _product_ProductsResponse>;
  
  getPopularProducts: grpc.handleUnaryCall<_product_PopularProductsRequest__Output, _product_ProductsResponse>;
  
  getProduct: grpc.handleUnaryCall<_product_ProductRequest__Output, _product_ProductResponse>;
  
}

export interface ProductServiceRoutesDefinition extends grpc.ServiceDefinition {
  getCategoryProducts: MethodDefinition<_product_CategoryProductsRequest, _product_ProductsResponse, _product_CategoryProductsRequest__Output, _product_ProductsResponse__Output>
  getPopularProducts: MethodDefinition<_product_PopularProductsRequest, _product_ProductsResponse, _product_PopularProductsRequest__Output, _product_ProductsResponse__Output>
  getProduct: MethodDefinition<_product_ProductRequest, _product_ProductResponse, _product_ProductRequest__Output, _product_ProductResponse__Output>
}
