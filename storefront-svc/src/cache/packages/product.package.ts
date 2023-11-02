/**
 * This package helps us encode and decode resources to a binary blob (Uint8Array)
 */
import { Product } from '@proto/generated/productPackage/Product';
import protobuf from 'protobufjs';
import { Service } from 'typedi';

const PROTO_PATH = './build/proto/product.proto';

@Service()
export default class ProductPackage extends protobuf.Root {
  root: protobuf.Root;
  Products: protobuf.Type;
  Product: protobuf.Type;
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

    this.Products = this.root.lookupType('productPackage.ProductsResponse');

    this.Product = this.root.lookupType('productPackage.ProductResponse');

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
   * @param {Product[]} products
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodeProducts = (
    products: Product[]
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Products.verify(products);
        if (errMsg) {
          reject({ error: errMsg });
        }
        const message = this.Products.create({ products });
        // Encode the message to a buffer
        const buffer = this.Products.encode(message).finish();
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
  public decodeProducts = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const popularProducts = this.Products.toObject(
          this.Products.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: popularProducts });
      } catch (error) {
        reject({ error });
      }
    });
  };

  /**
   * @param {Product} product
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodeProduct = (
    product: Product
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Product.verify(product);
        if (errMsg) {
          reject({ error: errMsg });
        }
        const message = this.Product.create({ product });
        // Encode the message to a buffer
        const buffer = this.Product.encode(message).finish();
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
  public decodeProduct = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const Product = this.Product.toObject(
          this.Product.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: Product });
      } catch (error) {
        reject({ error });
      }
    });
  };
}
