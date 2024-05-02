/**
 * This package helps us encode and decode resources to a binary blob (Uint8Array)
 */
import { Layout } from '@proto/generated/layout/Layout';
import protobuf from 'protobufjs';
import { Service } from 'typedi';

const PROTO_PATH = './dist/proto/layout.proto';

@Service()
export default class LayoutPackage extends protobuf.Root {
  root: protobuf.Root;
  Layout: protobuf.Type;
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
    this.Layout = this.root.lookupType('layout.LayoutResponse');
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
   * @param {Layout} layout
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encode = (
    layout: Layout
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Layout.verify(layout);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.Layout.create({ layout });
        // Encode the message to a buffer
        const buffer = this.Layout.encode(message).finish();
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
  public decode = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const layout = this.Layout.toObject(
          this.Layout.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: layout });
      } catch (error) {
        reject({ error });
      }
    });
  };
}
