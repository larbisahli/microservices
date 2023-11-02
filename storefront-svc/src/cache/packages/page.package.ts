/**
 * This package helps us encode and decode resources to a binary blob (Uint8Array)
 */
import { Page } from '@proto/generated/PagePackage/Page';
import protobuf from 'protobufjs';
import { Service } from 'typedi';

const PROTO_PATH = './build/proto/page.proto';

@Service()
export default class PagePackage extends protobuf.Root {
  root: protobuf.Root;
  Page: protobuf.Type;
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
    this.Page = this.root.lookupType('PagePackage.StorePageResponse');

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
   * @param {Page} page
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodePage = (
    page: Page
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Page.verify(page);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.Page.create({ page });
        // Encode the message to a buffer
        const buffer = this.Page.encode(message).finish();
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
  public decodePage = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const page = this.Page.toObject(
          this.Page.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: page });
      } catch (error) {
        reject({ error });
      }
    });
  };
}
