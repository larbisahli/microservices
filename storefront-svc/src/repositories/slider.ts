import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { SliderQueries } from '@sql';
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
   */
  constructor(protected sliderQueries: SliderQueries) {
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
    sliders: HeroBanner__Output[];
  }> => {
    const { getHeroSlider } = this.sliderQueries;
    const { alias } = call.request;

    const client = await this.transaction({
      actions: [this.ACTION_PRIVILEGES.READ],
    });

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        sliders: [],
      };
    }

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          sliders: [],
        };
      }

      const { rows } = await client.query<HeroBanner__Output>(getHeroSlider());

      await client.query('COMMIT');

      return { sliders: rows, error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        sliders: [],
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
    banner: StorePromoBanner | null;
  }> => {
    const { getStorePromoSlide } = this.sliderQueries;
    const { alias } = call.request;

    const client = await this.transaction({
      actions: [this.ACTION_PRIVILEGES.READ],
    });

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        banner: null,
      };
    }

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          banner: null,
        };
      }

      const { rows } = await client.query<StorePromoBanner>(
        getStorePromoSlide()
      );

      await client.query('COMMIT');

      return { banner: rows[0], error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        banner: null,
      };
    } finally {
      client.release();
    }
  };
}
