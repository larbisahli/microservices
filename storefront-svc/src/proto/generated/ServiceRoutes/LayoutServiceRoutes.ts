// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  LayoutRequest as _layout_LayoutRequest,
  LayoutRequest__Output as _layout_LayoutRequest__Output,
} from '../layout/LayoutRequest';
import type {
  LayoutResponse as _layout_LayoutResponse,
  LayoutResponse__Output as _layout_LayoutResponse__Output,
} from '../layout/LayoutResponse';

export interface LayoutServiceRoutesClient extends grpc.Client {
  getPageLayout(
    argument: _layout_LayoutRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_layout_LayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getPageLayout(
    argument: _layout_LayoutRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_layout_LayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getPageLayout(
    argument: _layout_LayoutRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_layout_LayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getPageLayout(
    argument: _layout_LayoutRequest,
    callback: grpc.requestCallback<_layout_LayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getPageLayout(
    argument: _layout_LayoutRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_layout_LayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getPageLayout(
    argument: _layout_LayoutRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_layout_LayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getPageLayout(
    argument: _layout_LayoutRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_layout_LayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getPageLayout(
    argument: _layout_LayoutRequest,
    callback: grpc.requestCallback<_layout_LayoutResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface LayoutServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getPageLayout: grpc.handleUnaryCall<
    _layout_LayoutRequest__Output,
    _layout_LayoutResponse
  >;
}

export interface LayoutServiceRoutesDefinition extends grpc.ServiceDefinition {
  getPageLayout: MethodDefinition<
    _layout_LayoutRequest,
    _layout_LayoutResponse,
    _layout_LayoutRequest__Output,
    _layout_LayoutResponse__Output
  >;
}
