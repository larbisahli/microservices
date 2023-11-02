// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  InvalidateResourceRequest as _ServiceRoutes_InvalidateResourceRequest,
  InvalidateResourceRequest__Output as _ServiceRoutes_InvalidateResourceRequest__Output,
} from '../ServiceRoutes/InvalidateResourceRequest';
import type {
  InvalidateResourceResponse as _ServiceRoutes_InvalidateResourceResponse,
  InvalidateResourceResponse__Output as _ServiceRoutes_InvalidateResourceResponse__Output,
} from '../ServiceRoutes/InvalidateResourceResponse';

export interface InvalidationServiceRoutesClient extends grpc.Client {
  invalidateResource(
    argument: _ServiceRoutes_InvalidateResourceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ServiceRoutes_InvalidateResourceResponse__Output>
  ): grpc.ClientUnaryCall;
  invalidateResource(
    argument: _ServiceRoutes_InvalidateResourceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ServiceRoutes_InvalidateResourceResponse__Output>
  ): grpc.ClientUnaryCall;
  invalidateResource(
    argument: _ServiceRoutes_InvalidateResourceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ServiceRoutes_InvalidateResourceResponse__Output>
  ): grpc.ClientUnaryCall;
  invalidateResource(
    argument: _ServiceRoutes_InvalidateResourceRequest,
    callback: grpc.requestCallback<_ServiceRoutes_InvalidateResourceResponse__Output>
  ): grpc.ClientUnaryCall;
  invalidateResource(
    argument: _ServiceRoutes_InvalidateResourceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ServiceRoutes_InvalidateResourceResponse__Output>
  ): grpc.ClientUnaryCall;
  invalidateResource(
    argument: _ServiceRoutes_InvalidateResourceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ServiceRoutes_InvalidateResourceResponse__Output>
  ): grpc.ClientUnaryCall;
  invalidateResource(
    argument: _ServiceRoutes_InvalidateResourceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ServiceRoutes_InvalidateResourceResponse__Output>
  ): grpc.ClientUnaryCall;
  invalidateResource(
    argument: _ServiceRoutes_InvalidateResourceRequest,
    callback: grpc.requestCallback<_ServiceRoutes_InvalidateResourceResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface InvalidationServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  invalidateResource: grpc.handleUnaryCall<
    _ServiceRoutes_InvalidateResourceRequest__Output,
    _ServiceRoutes_InvalidateResourceResponse
  >;
}

export interface InvalidationServiceRoutesDefinition
  extends grpc.ServiceDefinition {
  invalidateResource: MethodDefinition<
    _ServiceRoutes_InvalidateResourceRequest,
    _ServiceRoutes_InvalidateResourceResponse,
    _ServiceRoutes_InvalidateResourceRequest__Output,
    _ServiceRoutes_InvalidateResourceResponse__Output
  >;
}
