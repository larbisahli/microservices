// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  HeroSlidesRequest as _slides_HeroSlidesRequest,
  HeroSlidesRequest__Output as _slides_HeroSlidesRequest__Output,
} from '../slides/HeroSlidesRequest';
import type {
  HeroSlidesResponse as _slides_HeroSlidesResponse,
  HeroSlidesResponse__Output as _slides_HeroSlidesResponse__Output,
} from '../slides/HeroSlidesResponse';
import type {
  PromoBannerRequest as _slides_PromoBannerRequest,
  PromoBannerRequest__Output as _slides_PromoBannerRequest__Output,
} from '../slides/PromoBannerRequest';
import type {
  PromoBannerResponse as _slides_PromoBannerResponse,
  PromoBannerResponse__Output as _slides_PromoBannerResponse__Output,
} from '../slides/PromoBannerResponse';

export interface SliderServiceRoutesClient extends grpc.Client {
  getHeroSlides(
    argument: _slides_HeroSlidesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slides_HeroSlidesResponse__Output>
  ): grpc.ClientUnaryCall;
  getHeroSlides(
    argument: _slides_HeroSlidesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_slides_HeroSlidesResponse__Output>
  ): grpc.ClientUnaryCall;
  getHeroSlides(
    argument: _slides_HeroSlidesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slides_HeroSlidesResponse__Output>
  ): grpc.ClientUnaryCall;
  getHeroSlides(
    argument: _slides_HeroSlidesRequest,
    callback: grpc.requestCallback<_slides_HeroSlidesResponse__Output>
  ): grpc.ClientUnaryCall;
  getHeroSlides(
    argument: _slides_HeroSlidesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slides_HeroSlidesResponse__Output>
  ): grpc.ClientUnaryCall;
  getHeroSlides(
    argument: _slides_HeroSlidesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_slides_HeroSlidesResponse__Output>
  ): grpc.ClientUnaryCall;
  getHeroSlides(
    argument: _slides_HeroSlidesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slides_HeroSlidesResponse__Output>
  ): grpc.ClientUnaryCall;
  getHeroSlides(
    argument: _slides_HeroSlidesRequest,
    callback: grpc.requestCallback<_slides_HeroSlidesResponse__Output>
  ): grpc.ClientUnaryCall;

  getPromoBanner(
    argument: _slides_PromoBannerRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slides_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromoBanner(
    argument: _slides_PromoBannerRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_slides_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromoBanner(
    argument: _slides_PromoBannerRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slides_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromoBanner(
    argument: _slides_PromoBannerRequest,
    callback: grpc.requestCallback<_slides_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromoBanner(
    argument: _slides_PromoBannerRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slides_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromoBanner(
    argument: _slides_PromoBannerRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_slides_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromoBanner(
    argument: _slides_PromoBannerRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_slides_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromoBanner(
    argument: _slides_PromoBannerRequest,
    callback: grpc.requestCallback<_slides_PromoBannerResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface SliderServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getHeroSlides: grpc.handleUnaryCall<
    _slides_HeroSlidesRequest__Output,
    _slides_HeroSlidesResponse
  >;

  getPromoBanner: grpc.handleUnaryCall<
    _slides_PromoBannerRequest__Output,
    _slides_PromoBannerResponse
  >;
}

export interface SliderServiceRoutesDefinition extends grpc.ServiceDefinition {
  getHeroSlides: MethodDefinition<
    _slides_HeroSlidesRequest,
    _slides_HeroSlidesResponse,
    _slides_HeroSlidesRequest__Output,
    _slides_HeroSlidesResponse__Output
  >;
  getPromoBanner: MethodDefinition<
    _slides_PromoBannerRequest,
    _slides_PromoBannerResponse,
    _slides_PromoBannerRequest__Output,
    _slides_PromoBannerResponse__Output
  >;
}
