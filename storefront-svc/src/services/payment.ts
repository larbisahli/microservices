import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { Status } from '@grpc/grpc-js/build/src/constants';
import PostgresClient from '@database';
import { CryptoUtils } from '@core';
import PaymentRepository from '@repository/payment.repository';
import { PaymentRequest } from '@proto/generated/payment/PaymentRequest';
import { PaymentResponse } from '@proto/generated/payment/PaymentResponse';
import { Payment } from '@proto/generated/payment/Payment';

@Service()
export default class PaymentHandler extends PostgresClient {
  /**
   * @param {PaymentRepository} paymentRepository
   */
  constructor(
    protected paymentRepository: PaymentRepository,
    protected cryptoUtils: CryptoUtils
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<PaymentRequest, PaymentResponse>} call
   * @returns {Promise<{payment: Payment}>}
   */
  public getPayments = async (
    call: ServerUnaryCall<PaymentRequest, PaymentResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { payments: Payment[] | [] };
  }> => {
    const { alias, suid } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { payments: [] },
      };
    }

    let storeId: string | null;
    if (suid) {
      storeId = await this.cryptoUtils.decrypt(suid);
    } else {
      storeId = await this.getStoreId({ alias });
    }

    if (!storeId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'store identifier is not defined',
        },
        response: { payments: [] },
      };
    }

    try {
      /** Check if resource is in the cache store */
      const { payments, error } = await this.paymentRepository.getPayments(
        storeId
      );

      if (error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: error.message,
          },
          response: { payments: [] },
        };
      }

      return { response: { payments }, error: null };
    } catch (error: any) {
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { payments: [] },
      };
    }
  };
}
