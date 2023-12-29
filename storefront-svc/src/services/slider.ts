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
import { ResourceNamesEnum } from '@ts-types/index';

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
    const resource = (await this.resourceHandler.getResource({
      alias,
      key: ResourceNamesEnum.HERO_SLIDE,
      name: ResourceNamesEnum.HERO_SLIDE,
    })) as { sliders: HeroSlide__Output[] | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          response: { sliders: null },
        };
      }

      const { rows } = await client.query<HeroSlide__Output>(
        getHeroSlides(storeLanguageId)
      );

      const sliders = rows;

      /** Set the resources in the cache store */
      if (sliders && alias) {
        this.resourceHandler.setResource({
          store,
          key: ResourceNamesEnum.HERO_SLIDE,
          name: ResourceNamesEnum.HERO_SLIDE,
          resource: sliders,
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
    const resource = (await this.resourceHandler.getResource({
      alias,
      key: ResourceNamesEnum.PROMO_SLIDE,
      name: ResourceNamesEnum.PROMO_SLIDE,
    })) as { banner: PromoBanner | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: {
            code: Status.INTERNAL,
            details: store?.error.message,
          },
          response: { banner: null },
        };
      }

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
      if (banner && alias) {
        this.resourceHandler.setResource({
          store,
          key: ResourceNamesEnum.PROMO_SLIDE,
          name: ResourceNamesEnum.PROMO_SLIDE,
          resource: banner,
        });
      }

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
