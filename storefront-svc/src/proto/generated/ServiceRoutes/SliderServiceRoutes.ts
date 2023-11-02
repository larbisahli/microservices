// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  HeroBannerRequest as _slidePackage_HeroBannerRequest,
  HeroBannerRequest__Output as _slidePackage_HeroBannerRequest__Output,
} from '../slidePackage/HeroBannerRequest';
import type {
  HeroBannerResponse as _slidePackage_HeroBannerResponse,
  HeroBannerResponse__Output as _slidePackage_HeroBannerResponse__Output,
} from '../slidePackage/HeroBannerResponse';
import type {
  PromoBannerRequest as _slidePackage_PromoBannerRequest,
  PromoBannerRequest__Output as _slidePackage_PromoBannerRequest__Output,
} from '../slidePackage/PromoBannerRequest';
import type {
  PromoBannerResponse as _slidePackage_PromoBannerResponse,
  PromoBannerResponse__Output as _slidePackage_PromoBannerResponse__Output,
} from '../slidePackage/PromoBannerResponse';

export interface SliderServiceRoutesClient extends grpc.Client {
  getStoreHeroBanner(
    argument: _slidePackage_HeroBannerRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slidePackage_HeroBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreHeroBanner(
    argument: _slidePackage_HeroBannerRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_slidePackage_HeroBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreHeroBanner(
    argument: _slidePackage_HeroBannerRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slidePackage_HeroBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreHeroBanner(
    argument: _slidePackage_HeroBannerRequest,
    callback: grpc.requestCallback<_slidePackage_HeroBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreHeroBanner(
    argument: _slidePackage_HeroBannerRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slidePackage_HeroBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreHeroBanner(
    argument: _slidePackage_HeroBannerRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_slidePackage_HeroBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreHeroBanner(
    argument: _slidePackage_HeroBannerRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slidePackage_HeroBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreHeroBanner(
    argument: _slidePackage_HeroBannerRequest,
    callback: grpc.requestCallback<_slidePackage_HeroBannerResponse__Output>
  ): grpc.ClientUnaryCall;

  getStorePromoBanner(
    argument: _slidePackage_PromoBannerRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slidePackage_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePromoBanner(
    argument: _slidePackage_PromoBannerRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_slidePackage_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePromoBanner(
    argument: _slidePackage_PromoBannerRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slidePackage_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePromoBanner(
    argument: _slidePackage_PromoBannerRequest,
    callback: grpc.requestCallback<_slidePackage_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePromoBanner(
    argument: _slidePackage_PromoBannerRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slidePackage_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePromoBanner(
    argument: _slidePackage_PromoBannerRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_slidePackage_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePromoBanner(
    argument: _slidePackage_PromoBannerRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slidePackage_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getStorePromoBanner(
    argument: _slidePackage_PromoBannerRequest,
    callback: grpc.requestCallback<_slidePackage_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface SliderServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getStoreHeroBanner: grpc.handleUnaryCall<
    _slidePackage_HeroBannerRequest__Output,
    _slidePackage_HeroBannerResponse
  >;

  getStorePromoBanner: grpc.handleUnaryCall<
    _slidePackage_PromoBannerRequest__Output,
    _slidePackage_PromoBannerResponse
  >;
}

export interface SliderServiceRoutesDefinition extends grpc.ServiceDefinition {
  getStoreHeroBanner: MethodDefinition<
    _slidePackage_HeroBannerRequest,
    _slidePackage_HeroBannerResponse,
    _slidePackage_HeroBannerRequest__Output,
    _slidePackage_HeroBannerResponse__Output
  >;
  getStorePromoBanner: MethodDefinition<
    _slidePackage_PromoBannerRequest,
    _slidePackage_PromoBannerResponse,
    _slidePackage_PromoBannerRequest__Output,
    _slidePackage_PromoBannerResponse__Output
  >;
}
