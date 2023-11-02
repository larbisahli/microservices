// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  StorePageRequest as _PagePackage_StorePageRequest,
  StorePageRequest__Output as _PagePackage_StorePageRequest__Output,
} from '../PagePackage/StorePageRequest';
import type {
  StorePageResponse as _PagePackage_StorePageResponse,
  StorePageResponse__Output as _PagePackage_StorePageResponse__Output,
} from '../PagePackage/StorePageResponse';

export interface PageServiceRoutesClient extends grpc.Client {
  getStorePage(
    argument: _PagePackage_StorePageRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_PagePackage_StorePageResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePage(
    argument: _PagePackage_StorePageRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_PagePackage_StorePageResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePage(
    argument: _PagePackage_StorePageRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_PagePackage_StorePageResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePage(
    argument: _PagePackage_StorePageRequest,
    callback: grpc.requestCallback<_PagePackage_StorePageResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePage(
    argument: _PagePackage_StorePageRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_PagePackage_StorePageResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePage(
    argument: _PagePackage_StorePageRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_PagePackage_StorePageResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePage(
    argument: _PagePackage_StorePageRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_PagePackage_StorePageResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePage(
    argument: _PagePackage_StorePageRequest,
    callback: grpc.requestCallback<_PagePackage_StorePageResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface PageServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getStorePage: grpc.handleUnaryCall<
    _PagePackage_StorePageRequest__Output,
    _PagePackage_StorePageResponse
  >;
}

export interface PageServiceRoutesDefinition extends grpc.ServiceDefinition {
  getStorePage: MethodDefinition<
    _PagePackage_StorePageRequest,
    _PagePackage_StorePageResponse,
    _PagePackage_StorePageRequest__Output,
    _PagePackage_StorePageResponse__Output
  >;
}
