/**
 * This package helps us turn objects info buffer, useful for storage
 */
import protobuf from 'protobufjs';
import { Service } from 'typedi';
import { Shipping } from '@proto/generated/shipping/Shipping';

const PROTO_PATH = './dist/proto/shipping.proto';

@Service()
export class ShippingPackage extends protobuf.Root {
  Shipping: protobuf.Type;
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
    this.Shipping = this.loadSync(PROTO_PATH).lookupType(
      'shipping.ShippingResponse'
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
   * @param {Shipping} shipping
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encode = (
    shippings: Shipping[]
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Shipping.verify({ shippings });
        if (errMsg) {
          reject({ error: errMsg });
        }
        const message = this.Shipping.create({ shippings });
        // Encode the message to a buffer
        const buffer = this.Shipping.encode(message).finish();
        resolve({ buffer });
      } catch (error) {
        reject({ error });
      }
    });
  };

  /**
   * @param {protobuf.Buffer} buffer
   * @returns {Promise<Shipping>}
   */
  public decode = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: any }> => {
    return new Promise((resolve, reject) => {
      try {
        const shippings = this.Shipping.toObject(
          this.Shipping.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: shippings });
      } catch (error) {
        reject({ error });
      }
    });
  };
}
