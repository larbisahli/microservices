import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class PaymentQueryString extends CommonQueryString {
  public getStorePayments() {
    const text = `SELECT id, code, type, data FROM store_payment WHERE store_id = current_setting('app.current_store_id')::uuid AND active IS TRUE`;

    return {
      name: 'get-storefront-payments',
      text,
      values: [],
    };
  }
}
