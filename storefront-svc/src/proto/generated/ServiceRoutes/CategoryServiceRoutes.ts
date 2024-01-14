// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CategoryRequest as _category_CategoryRequest, CategoryRequest__Output as _category_CategoryRequest__Output } from '../category/CategoryRequest';
import type { CategoryResponse as _category_CategoryResponse, CategoryResponse__Output as _category_CategoryResponse__Output } from '../category/CategoryResponse';
import type { HomePageCategoryRequest as _category_HomePageCategoryRequest, HomePageCategoryRequest__Output as _category_HomePageCategoryRequest__Output } from '../category/HomePageCategoryRequest';
import type { HomePageCategoryResponse as _category_HomePageCategoryResponse, HomePageCategoryResponse__Output as _category_HomePageCategoryResponse__Output } from '../category/HomePageCategoryResponse';
import type { MenuRequest as _category_MenuRequest, MenuRequest__Output as _category_MenuRequest__Output } from '../category/MenuRequest';
import type { MenuResponse as _category_MenuResponse, MenuResponse__Output as _category_MenuResponse__Output } from '../category/MenuResponse';

export interface CategoryServiceRoutesClient extends grpc.Client {
  getCategory(argument: _category_CategoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_category_CategoryResponse__Output>): grpc.ClientUnaryCall;
  getCategory(argument: _category_CategoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_category_CategoryResponse__Output>): grpc.ClientUnaryCall;
  getCategory(argument: _category_CategoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_category_CategoryResponse__Output>): grpc.ClientUnaryCall;
  getCategory(argument: _category_CategoryRequest, callback: grpc.requestCallback<_category_CategoryResponse__Output>): grpc.ClientUnaryCall;
  getCategory(argument: _category_CategoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_category_CategoryResponse__Output>): grpc.ClientUnaryCall;
  getCategory(argument: _category_CategoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_category_CategoryResponse__Output>): grpc.ClientUnaryCall;
  getCategory(argument: _category_CategoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_category_CategoryResponse__Output>): grpc.ClientUnaryCall;
  getCategory(argument: _category_CategoryRequest, callback: grpc.requestCallback<_category_CategoryResponse__Output>): grpc.ClientUnaryCall;
  
  getHomePageCategories(argument: _category_HomePageCategoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_category_HomePageCategoryResponse__Output>): grpc.ClientUnaryCall;
  getHomePageCategories(argument: _category_HomePageCategoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_category_HomePageCategoryResponse__Output>): grpc.ClientUnaryCall;
  getHomePageCategories(argument: _category_HomePageCategoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_category_HomePageCategoryResponse__Output>): grpc.ClientUnaryCall;
  getHomePageCategories(argument: _category_HomePageCategoryRequest, callback: grpc.requestCallback<_category_HomePageCategoryResponse__Output>): grpc.ClientUnaryCall;
  getHomePageCategories(argument: _category_HomePageCategoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_category_HomePageCategoryResponse__Output>): grpc.ClientUnaryCall;
  getHomePageCategories(argument: _category_HomePageCategoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_category_HomePageCategoryResponse__Output>): grpc.ClientUnaryCall;
  getHomePageCategories(argument: _category_HomePageCategoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_category_HomePageCategoryResponse__Output>): grpc.ClientUnaryCall;
  getHomePageCategories(argument: _category_HomePageCategoryRequest, callback: grpc.requestCallback<_category_HomePageCategoryResponse__Output>): grpc.ClientUnaryCall;
  
  getMenu(argument: _category_MenuRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_category_MenuResponse__Output>): grpc.ClientUnaryCall;
  getMenu(argument: _category_MenuRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_category_MenuResponse__Output>): grpc.ClientUnaryCall;
  getMenu(argument: _category_MenuRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_category_MenuResponse__Output>): grpc.ClientUnaryCall;
  getMenu(argument: _category_MenuRequest, callback: grpc.requestCallback<_category_MenuResponse__Output>): grpc.ClientUnaryCall;
  getMenu(argument: _category_MenuRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_category_MenuResponse__Output>): grpc.ClientUnaryCall;
  getMenu(argument: _category_MenuRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_category_MenuResponse__Output>): grpc.ClientUnaryCall;
  getMenu(argument: _category_MenuRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_category_MenuResponse__Output>): grpc.ClientUnaryCall;
  getMenu(argument: _category_MenuRequest, callback: grpc.requestCallback<_category_MenuResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface CategoryServiceRoutesHandlers extends grpc.UntypedServiceImplementation {
  getCategory: grpc.handleUnaryCall<_category_CategoryRequest__Output, _category_CategoryResponse>;
  
  getHomePageCategories: grpc.handleUnaryCall<_category_HomePageCategoryRequest__Output, _category_HomePageCategoryResponse>;
  
  getMenu: grpc.handleUnaryCall<_category_MenuRequest__Output, _category_MenuResponse>;
  
}

export interface CategoryServiceRoutesDefinition extends grpc.ServiceDefinition {
  getCategory: MethodDefinition<_category_CategoryRequest, _category_CategoryResponse, _category_CategoryRequest__Output, _category_CategoryResponse__Output>
  getHomePageCategories: MethodDefinition<_category_HomePageCategoryRequest, _category_HomePageCategoryResponse, _category_HomePageCategoryRequest__Output, _category_HomePageCategoryResponse__Output>
  getMenu: MethodDefinition<_category_MenuRequest, _category_MenuResponse, _category_MenuRequest__Output, _category_MenuResponse__Output>
}
