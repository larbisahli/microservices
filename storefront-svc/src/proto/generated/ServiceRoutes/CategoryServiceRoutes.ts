// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  CategoryRequest as _categoryPackage_CategoryRequest,
  CategoryRequest__Output as _categoryPackage_CategoryRequest__Output,
} from '../categoryPackage/CategoryRequest';
import type {
  CategoryResponse as _categoryPackage_CategoryResponse,
  CategoryResponse__Output as _categoryPackage_CategoryResponse__Output,
} from '../categoryPackage/CategoryResponse';
import type {
  MenuRequest as _categoryPackage_MenuRequest,
  MenuRequest__Output as _categoryPackage_MenuRequest__Output,
} from '../categoryPackage/MenuRequest';
import type {
  MenuResponse as _categoryPackage_MenuResponse,
  MenuResponse__Output as _categoryPackage_MenuResponse__Output,
} from '../categoryPackage/MenuResponse';

export interface CategoryServiceRoutesClient extends grpc.Client {
  getStoreCategory(
    argument: _categoryPackage_CategoryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_categoryPackage_CategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreCategory(
    argument: _categoryPackage_CategoryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_categoryPackage_CategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreCategory(
    argument: _categoryPackage_CategoryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_categoryPackage_CategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreCategory(
    argument: _categoryPackage_CategoryRequest,
    callback: grpc.requestCallback<_categoryPackage_CategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreCategory(
    argument: _categoryPackage_CategoryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_categoryPackage_CategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreCategory(
    argument: _categoryPackage_CategoryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_categoryPackage_CategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreCategory(
    argument: _categoryPackage_CategoryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_categoryPackage_CategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreCategory(
    argument: _categoryPackage_CategoryRequest,
    callback: grpc.requestCallback<_categoryPackage_CategoryResponse__Output>
  ): grpc.ClientUnaryCall;

  getStoreMenu(
    argument: _categoryPackage_MenuRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_categoryPackage_MenuResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreMenu(
    argument: _categoryPackage_MenuRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_categoryPackage_MenuResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreMenu(
    argument: _categoryPackage_MenuRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_categoryPackage_MenuResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreMenu(
    argument: _categoryPackage_MenuRequest,
    callback: grpc.requestCallback<_categoryPackage_MenuResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreMenu(
    argument: _categoryPackage_MenuRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_categoryPackage_MenuResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreMenu(
    argument: _categoryPackage_MenuRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_categoryPackage_MenuResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreMenu(
    argument: _categoryPackage_MenuRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_categoryPackage_MenuResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreMenu(
    argument: _categoryPackage_MenuRequest,
    callback: grpc.requestCallback<_categoryPackage_MenuResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface CategoryServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getStoreCategory: grpc.handleUnaryCall<
    _categoryPackage_CategoryRequest__Output,
    _categoryPackage_CategoryResponse
  >;

  getStoreMenu: grpc.handleUnaryCall<
    _categoryPackage_MenuRequest__Output,
    _categoryPackage_MenuResponse
  >;
}

export interface CategoryServiceRoutesDefinition
  extends grpc.ServiceDefinition {
  getStoreCategory: MethodDefinition<
    _categoryPackage_CategoryRequest,
    _categoryPackage_CategoryResponse,
    _categoryPackage_CategoryRequest__Output,
    _categoryPackage_CategoryResponse__Output
  >;
  getStoreMenu: MethodDefinition<
    _categoryPackage_MenuRequest,
    _categoryPackage_MenuResponse,
    _categoryPackage_MenuRequest__Output,
    _categoryPackage_MenuResponse__Output
  >;
}
