import PostgresClient from '@database';
import { Service } from 'typedi';
import { PaymentQueryString } from '@sql';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { PaymentCacheStore } from '@cache/payment.store';
import { Payment } from '@proto/generated/payment/Payment';
import { base64EncoderBuffer } from '@utils/index';

@Service()
export default class PaymentRepository extends PostgresClient {
  /**
   * @param {PaymentCacheStore} paymentCacheStore
   * @param {ShippingQueries} shippingQueries
   */
  constructor(
    protected paymentCacheStore: PaymentCacheStore,
    protected paymentQueryString: PaymentQueryString
  ) {
    super();
  }

  /**
   * @param {string} storeId
   * @returns {Promise<{ payments: Payment[] | []; error: any }>}
   */
  public getPayments = async (
    storeId: string
  ): Promise<{ payments: Payment[] | []; error: any }> => {
    const { getStorePayments } = this.paymentQueryString;

    /** Check if resource is in the cache store */
    const resource = (await this.paymentCacheStore.getPayments(storeId)) as {
      payments: Payment[] | [];
    };

    if (!!resource?.payments) {
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
          payments: [],
        };
      }

      const { rows } = await client.query<Payment>(getStorePayments());

      let payments = rows.map((payment) => ({
        ...payment,
        data: base64EncoderBuffer(payment.data),
      }));

      /** Set the resources in the cache store */
      if (payments && storeId) {
        this.paymentCacheStore.setPayments({
          storeId,
          resource: payments,
        });
      }

      await client.query('COMMIT');

      return { payments, error: null };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: { message },
        payments: [],
      };
    } finally {
      client.release();
    }
  };
}
