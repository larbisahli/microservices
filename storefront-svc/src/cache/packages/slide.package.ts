/**
 * This package helps us encode and decode resources to a binary blob (Uint8Array)
 */
import { StoreHeroBanner } from '@proto/generated/slidePackage/StoreHeroBanner';
import { StorePromoBanner } from '@proto/generated/slidePackage/StorePromoBanner';
import protobuf from 'protobufjs';
import { Service } from 'typedi';

const PROTO_PATH = './dist/proto/slide.proto';

@Service()
export default class SlidePackage extends protobuf.Root {
  root: protobuf.Root;
  HeroBanner: protobuf.Type;
  PromoBanner: protobuf.Type;

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

    this.HeroBanner = this.root.lookupType('slidePackage.HeroBannerResponse');
    this.PromoBanner = this.root.lookupType('slidePackage.PromoBannerResponse');

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
   * @param {StoreHeroBanner[]} sliders
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodeHeroBanner = (
    sliders: StoreHeroBanner[]
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.HeroBanner.verify(sliders);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.HeroBanner.create({ sliders });
        // Encode the message to a buffer
        const buffer = this.HeroBanner.encode(message).finish();
        resolve({ buffer });
      } catch (error) {
        reject({ from: 'encodeHeroBanner', error });
      }
    });
  };

  /**
   * @param {protobuf.Buffer} buffer
   * @returns {Promise<{ resource: any; error?: unknown }> }
   */
  public decodeHeroBanner = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const heroBanner = this.HeroBanner.toObject(
          this.HeroBanner.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: heroBanner });
      } catch (error) {
        reject({ error });
      }
    });
  };

  /**
   * @param {StorePromoBanner} banner
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodePromoBanner = (
    banner: StorePromoBanner
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.PromoBanner.verify(banner);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.PromoBanner.create({ banner });
        // Encode the message to a buffer
        const buffer = this.PromoBanner.encode(message).finish();
        resolve({ buffer });
      } catch (error) {
        reject({ from: 'encodePromoBanner', error });
      }
    });
  };

  /**
   * @param {protobuf.Buffer} buffer
   * @returns {Promise<{ resource: any; error?: unknown }> }
   */
  public decodePromoBanner = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const promoBanner = this.PromoBanner.toObject(
          this.PromoBanner.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: promoBanner });
      } catch (error) {
        reject({ error });
      }
    });
  };
}
