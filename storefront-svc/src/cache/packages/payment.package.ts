/**
 * This package helps us turn objects info buffer, useful for storage
 */
import protobuf from 'protobufjs';
import { Service } from 'typedi';
import { Payment } from '@proto/generated/payment/Payment';

const PROTO_PATH = './dist/proto/payment.proto';

@Service()
export class PaymentPackage extends protobuf.Root {
  Payment: protobuf.Type;
  decodeOptions: {
    enums: StringConstructor; // enums as string names
    longs: StringConstructor; // longs as strings (requires long.js)
    bytes: StringConstructor; // bytes as base64 encoded strings
    defaults: boolean; // includes default values
    arrays: boolean; // populates empty arrays (repeated fields) even if defaults=false
    objects: boolean; // populates empty objects (map fields) even if defaults=false
    oneofs: boolean; // includes virtual oneof fields set to the present field's name
  };

  constructor() {
    super();
    this.Payment = this.loadSync(PROTO_PATH).lookupType(
      'payment.PaymentResponse'
    );
    this.decodeOptions = {
      enums: String,
      longs: String,
      bytes: String,
      defaults: true,
      arrays: true,
      objects: true,
      oneofs: true,
    };
  }

  /**
   * @param {Payment[]} payments
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encode = (
    payments: Payment[]
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Payment.verify({ payments });
        if (errMsg) {
          reject({ error: errMsg });
        }
        const message = this.Payment.create({ payments });
        // Encode the message to a buffer
        const buffer = this.Payment.encode(message).finish();
        resolve({ buffer });
      } catch (error) {
        reject({ error });
      }
    });
  };

  /**
   * @param {protobuf.Buffer} buffer
   * @returns {Promise<Payment>}
   */
  public decode = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: any }> => {
    return new Promise((resolve, reject) => {
      try {
        const payments = this.Payment.toObject(
          this.Payment.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: payments });
      } catch (error) {
        reject({ error });
      }
    });
  };
}
