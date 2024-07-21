import { Logger } from '@core';
import { Service } from 'typedi';
import { isEmpty } from 'underscore';
import PaymentCache from './models/payment';
import byteSize from 'byte-size';
import crypto from 'crypto';
import { PaymentPackage } from './packages/payment.package';
import { Payment } from '@proto/generated/payment/Payment';

@Service()
export class PaymentCacheStore {
  constructor(protected paymentPackage: PaymentPackage) {}

  private getId = (storeId: string) => {
    return crypto.createHash('sha256').update(storeId).digest('hex');
  };

  public getPayments = async (storeId: string) => {
    try {
      const resource = await PaymentCache.findOne({
        key: { $eq: this.getId(storeId) },
      });

      if (isEmpty(resource && resource.data)) {
        return null;
      }

      /**
       * Convert the data from Buffer to object
       */
      return (await this.paymentPackage.decode(resource?.data!))?.resource;
    } catch (error) {
      Logger.system.error((error as Error).message);
      console.log('getPayments >>', { error });
      throw error;
    }
  };

  public setPayments = async ({
    storeId,
    resource,
  }: {
    storeId: string;
    resource: Payment[];
  }) => {
    try {
      /**
       * Storing the buffer directly into the db will save up to 46% storage space
       */
      const { buffer, error } = await this.paymentPackage.encode(resource);

      if (error) {
        throw error;
      }

      if (isEmpty(buffer)) {
        return true;
      }

      // Calculate the data size for future inspection (mongodb doc max size is 16MB)
      const { value, unit } = byteSize(buffer?.length, {
        precision: 2,
      });

      const respond = await PaymentCache.create({
        key: this.getId(storeId),
        data: buffer,
        storeId,
        size: `${value}${unit}`,
      });

      return respond;
    } catch (error) {
      Logger.system.error(error);
      console.log('setPayments >>', { error });
    }
  };

  public invalidateShippingCache = async (storeId: string) => {
    try {
      const respond = await PaymentCache.deleteOne({
        key: { $eq: this.getId(storeId) },
      });
      console.log({ respond });
    } catch (error) {
      Logger.system.error(error);
      console.log('invalidatePaymentCache >>', { error });
    }
  };
}
