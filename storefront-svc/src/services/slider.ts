import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { SliderQueries } from '@sql';
import { ResourceHandler } from '@cache/resource.store';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { HeroSlidesRequest } from '@proto/generated/slides/HeroSlidesRequest';
import { HeroSlidesResponse } from '@proto/generated/slides/HeroSlidesResponse';
import { HeroSlide__Output } from '@proto/generated/slides/HeroSlide';
import { PromoBannerRequest } from '@proto/generated/slides/PromoBannerRequest';
import { PromoBannerResponse } from '@proto/generated/slides/PromoBannerResponse';
import { PromoBanner } from '@proto/generated/slides/PromoBanner';

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
  public getHeroSlides = async (
    call: ServerUnaryCall<HeroSlidesRequest, HeroSlidesResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { sliders: HeroSlide__Output[] | null };
  }> => {
    const { getHeroSlides } = this.sliderQueries;
    const { alias, storeId, storeLanguageId } = call.request;

    if (!alias || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { sliders: [] },
      };
    }

    /** Check if resource is in the cache store */
    // const resource = (await this.resourceHandler.getResource({
    //   alias,
    //   resourceName: 'heroSlide',
    //   packageName: 'heroSlide',
    // })) as { sliders: HeroSlide__Output[] | null };

    // if (resource) {
    //   return { error: null, response: resource };
    // }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      await this.setupStoreSessions(client, { alias, storeId });

      const { rows } = await client.query<HeroSlide__Output>(
        getHeroSlides(storeLanguageId)
      );

      const sliders = rows;

      /** Set the resources in the cache store */
      // if (sliders && alias) {
      //   this.resourceHandler.setResource({
      //     alias,
      //     resource: sliders,
      //     resourceName: 'heroSlide',
      //     packageName: 'heroSlide',
      //   });
      // }

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
    response: { banner: PromoBanner | null };
  }> => {
    const { getStorePromoSlide, getPromoSlideTranslation } = this.sliderQueries;
    const { alias, storeId, storeLanguageId } = call.request;

    if (!alias || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { banner: null },
      };
    }

    /** Check if resource is in the cache store */
    // const resource = (await this.resourceHandler.getResource({
    //   alias,
    //   resourceName: 'promoSlide',
    //   packageName: 'promoSlide',
    // })) as { banner: PromoBanner | null };

    // if (resource) {
    //   return { error: null, response: resource };
    // }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      await this.setupStoreSessions(client, { alias, storeId });

      interface banner extends PromoBanner {
        id: number;
      }

      const { rows } = await client.query<banner>(getStorePromoSlide());
      const banner = rows[0];

      console.log({ banner });

      if (!banner) {
        return {
          response: { banner: {} },
          error: null,
        };
      }

      const { rows: slide } = await client.query<PromoBanner>(
        getPromoSlideTranslation(banner?.id, storeLanguageId)
      );

      const { direction, sliders } = slide[0];

      /** Set the resources in the cache store */
      // if (banner && alias) {
      //   this.resourceHandler.setResource({
      //     alias,
      //     resource: banner,
      //     resourceName: 'promoSlide',
      //     packageName: 'promoSlide',
      //   });
      // }

      await client.query('COMMIT');

      return {
        response: { banner: { ...banner, direction, sliders } },
        error: null,
      };
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
