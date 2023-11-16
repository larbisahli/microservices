import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { SliderQueries } from '@sql';
import { ResourceHandler } from '@cache/resource.store';
import { HeroBanner__Output } from '@proto/generated/slidePackage/HeroBanner';
import { HeroBannerRequest } from '@proto/generated/slidePackage/HeroBannerRequest';
import { HeroBannerResponse } from '@proto/generated/slidePackage/HeroBannerResponse';
import { PromoBannerRequest } from '@proto/generated/slidePackage/PromoBannerRequest';
import { PromoBannerResponse } from '@proto/generated/slidePackage/PromoBannerResponse';
import { StorePromoBanner } from '@proto/generated/slidePackage/StorePromoBanner';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class SlideHandler extends PostgresClient {
  /**
   * @param {SliderQueries} sliderQueries
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected sliderQueries: SliderQueries,
    protected resourceHandler: ResourceHandler
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<StaffRequest, Staff>} call
   * @returns {Promise<Menu__Output[]>}
   */
  public getHeroSlider = async (
    call: ServerUnaryCall<HeroBannerRequest, HeroBannerResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { sliders: HeroBanner__Output[] | null };
  }> => {
    const { getHeroSlider } = this.sliderQueries;
    const { alias } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { sliders: [] },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: 'heroSlide',
      packageName: 'heroSlide',
    })) as { sliders: HeroBanner__Output[] | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction(alias);

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          response: { sliders: [] },
        };
      }

      const { rows } = await client.query<HeroBanner__Output>(getHeroSlider());

      const sliders = rows;

      /** Set the resources in the cache store */
      if (sliders && alias) {
        this.resourceHandler.setResource({
          alias,
          resource: sliders,
          resourceName: 'heroSlide',
          packageName: 'heroSlide',
        });
      }

      await client.query('COMMIT');

      return { response: { sliders }, error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { sliders: [] },
      };
    } finally {
      client.release();
    }
  };

  /**
   * @param { ServerUnaryCall<StaffRequest, Staff>} call
   * @returns {Promise<Menu__Output[]>}
   */
  public getPromoSlider = async (
    call: ServerUnaryCall<PromoBannerRequest, PromoBannerResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { banner: StorePromoBanner | null };
  }> => {
    const { getStorePromoSlide } = this.sliderQueries;
    const { alias } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
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

    const client = await this.transaction(alias);

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          response: { banner: null },
        };
      }

      const { rows } = await client.query<StorePromoBanner>(
        getStorePromoSlide()
      );

      const banner = rows[0];

      /** Set the resources in the cache store */
      if (banner && alias) {
        this.resourceHandler.setResource({
          alias,
          resource: banner,
          resourceName: 'promoSlide',
          packageName: 'promoSlide',
        });
      }

      await client.query('COMMIT');

      return { response: { banner }, error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { banner: null },
      };
    } finally {
      client.release();
    }
  };
}
