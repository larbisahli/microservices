import { ServerErrorResponse, StatusObject } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { Service } from 'typedi';
import { SliderRpcService } from '@gRPC/client/services';
import { StoreHeroBanner__Output } from '@proto/generated/slidePackage/StoreHeroBanner';
import { HeroBannerRequest } from '@proto/generated/slidePackage/HeroBannerRequest';
import { HeroBannerResponse } from '@proto/generated/slidePackage/HeroBannerResponse';
import { ResourceHandler } from '@cache/resource.store';
import { PromoBannerRequest } from '@proto/generated/slidePackage/PromoBannerRequest';
import { PromoBannerResponse } from '@proto/generated/slidePackage/PromoBannerResponse';
import { StorePromoBanner } from '@proto/generated/slidePackage/StorePromoBanner';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class SlideHandler {
  /**
   * @param {SliderRpcService} sliderRpcService
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected sliderRpcService: SliderRpcService,
    protected resourceHandler: ResourceHandler
  ) {}

  /**
   * @param { ServerUnaryCall<HeroBannerRequest, HeroBannerResponse>} call
   * @returns {Promise<StoreHeroBanner__Output[]>}
   */
  public getHeroSlide = async (
    call: grpc.ServerUnaryCall<HeroBannerRequest, HeroBannerResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { sliders: StoreHeroBanner__Output[] | null };
  }> => {
    const { alias } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Unknown error',
        },
        response: { sliders: [] },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: 'heroSlide',
      packageName: 'heroSlide',
    })) as { sliders: StoreHeroBanner__Output[] | null };

    if (resource) {
      return { error: null, response: resource };
    }

    /** Remote procedure call to get menu from business server */
    const response = await this.sliderRpcService.getStoreHeroSlide(alias);

    const { sliders = [], error } = response;

    /** Set the resources in the cache store */
    if (sliders && alias) {
      this.resourceHandler.setResource({
        alias,
        resource: sliders,
        resourceName: 'heroSlide',
        packageName: 'heroSlide',
      });
    }

    return { error, response: { sliders } };
  };

  /**
   * @param { ServerUnaryCall<HeroBannerRequest, HeroBannerResponse>} call
   * @returns {Promise<StorePromoBanner>}
   */
  public getPromoSlide = async (
    call: grpc.ServerUnaryCall<PromoBannerRequest, PromoBannerResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { banner: StorePromoBanner | null };
  }> => {
    const { alias } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Unknown error',
        },
        response: { banner: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: 'promoSlide',
      packageName: 'promoSlide',
    })) as { banner: StorePromoBanner | null };

    if (resource) {
      return { error: null, response: resource };
    }

    /** Remote procedure call to get menu from business server */
    const response = await this.sliderRpcService.getStorePromoSlide(alias);

    const { banner = null, error } = response;

    /** Set the resources in the cache store */
    if (banner && alias) {
      this.resourceHandler.setResource({
        alias,
        resource: banner,
        resourceName: 'promoSlide',
        packageName: 'promoSlide',
      });
    }

    return { error, response: { banner } };
  };
}
