/**
 * This package helps us turn objects info buffer, useful for storage
 */
import protobuf from 'protobufjs';
import { Checkout } from '@proto/generated/checkout/Checkout';
import { Service } from 'typedi';

const PROTO_PATH = './dist/proto/checkout.proto';

@Service()
export class CheckoutPackage extends protobuf.Root {
  Checkout: protobuf.Type;
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
    this.Checkout = this.loadSync(PROTO_PATH).lookupType('checkout.Checkout');
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
   * @param {Cart} cart
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encode = (
    checkout: Checkout
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Checkout.verify(checkout);
        if (errMsg) {
          reject({ error: errMsg });
        }
        const message = this.Checkout.create(checkout);
        // Encode the message to a buffer
        const buffer = this.Checkout.encode(message).finish();
        resolve({ buffer });
      } catch (error) {
        reject({ error });
      }
    });
  };

  /**
   * @param {protobuf.Buffer} buffer
   * @returns {Promise<{ resource: any; error?: unknown }>}
   */
  public decode = (buffer: protobuf.Buffer): Promise<Checkout> => {
    return new Promise((resolve, reject) => {
      try {
        const checkout = this.Checkout.toObject(
          this.Checkout.decode(buffer),
          this.decodeOptions
        );
        resolve(checkout);
      } catch (error) {
        reject({ error });
      }
    });
  };
}
