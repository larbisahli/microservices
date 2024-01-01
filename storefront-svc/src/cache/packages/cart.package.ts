/**
 * This package helps us encode and decode resources to a binary blob (Uint8Array)
 */
import protobuf from 'protobufjs';
import Container, { Service } from 'typedi';

const PROTO_PATH = './dist/proto/cart.proto';

@Service()
export class CartPackage extends protobuf.Root {
  root: protobuf.Root;
  Cart: protobuf.Type;
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
    this.root = this.loadSync(PROTO_PATH);
    this.Cart = this.root.lookupType('cart.Cart');
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
   * @param {Settings} config
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encode = (cart: { id: string; name: string }): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Cart.verify(cart);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.Cart.create(cart);
        // Encode the message to a buffer
        const buffer = this.Cart.encode(message).finish();
        resolve(buffer);
      } catch (error) {
        reject({ error });
      }
    });
  };

  /**
   * @param {protobuf.Buffer} buffer
   * @returns {Promise<{ resource: any; error?: unknown }>}
   */
  public decode = (buffer: protobuf.Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        const cart = this.Cart.toObject(
          this.Cart.decode(buffer),
          this.decodeOptions
        );
        resolve(cart);
      } catch (error) {
        reject({ error });
      }
    });
  };
}

export default Container.get(CartPackage);
