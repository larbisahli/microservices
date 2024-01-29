import PostgresClient from '@database';
import { Service } from 'typedi';
import { ShippingQueries } from '@sql';
import { Shipping } from '@proto/generated/shipping/Shipping';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ShippingCacheStore } from '@cache/shipping.store';

@Service()
export default class ShippingRepository extends PostgresClient {
  /**
   * @param {ShippingCacheStore} shippingCacheStore
   * @param {ShippingQueries} shippingQueries
   */
  constructor(
    protected shippingCacheStore: ShippingCacheStore,
    protected shippingQueries: ShippingQueries
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<ProductRequest, ProductResponse>} call
   * @returns {Promise<ProductInterface>}
   */
  public getShippings = async (
    storeId: string
  ): Promise<{ shippings: Shipping[] | []; error: any }> => {
    const { getShippingZones, getZones, getShippingRates } =
      this.shippingQueries;

    /** Check if resource is in the cache store */
    const resource = (await this.shippingCacheStore.getShippings(storeId)) as {
      shippings: Shipping[] | [];
    };

    if (!!resource?.shippings) {
      return { error: null, ...resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, storeId);

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          shippings: [],
        };
      }

      const { rows: shippingZones } = await client.query<Shipping>(
        getShippingZones()
      );

      const shippings = [];

      // Get full products
      for await (const { id, ...rest } of shippingZones ?? []) {
        if (!id) {
          continue;
        }

        const { rows: zones } = await client.query<Shipping>(getZones(id));
        const { rows: rates } = await client.query<Shipping>(
          getShippingRates(id)
        );

        shippings.push({
          id,
          ...rest,
          zones,
          rates,
        });
      }

      /** Set the resources in the cache store */
      if (shippings && storeId) {
        this.shippingCacheStore.setShippings({
          storeId,
          resource: shippings,
        });
      }

      await client.query('COMMIT');

      return { shippings, error: null };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: { message },
        shippings: [],
      };
    } finally {
      client.release();
    }
  };
}
