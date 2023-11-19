/**
 * This package helps us encode and decode resources to a binary blob (Uint8Array)
 */
import { HeroSlide } from '@proto/generated/slides/HeroSlide';
import { PromoBanner } from '@proto/generated/slides/PromoBanner';
import protobuf from 'protobufjs';
import { Service } from 'typedi';

const PROTO_PATH = './dist/proto/slides.proto';

@Service()
export default class SlidePackage extends protobuf.Root {
  root: protobuf.Root;
  HeroBanner: protobuf.Type;
  PromoBanner: protobuf.Type;

  decodeOptions: {
    enums: StringConstructor; // enums as string names
    longs: StringConstructor; // longs as strings (requires long.js)
    bytes: StringConstructor; // bytes as base64 encoded stringsBanne
    defaults: boolean; // includes default values
    arrays: boolean; // populates empty arrays (repeated fields) even if defaults=false
    objects: boolean; // populates empty objects (map fields) even if defaults=false
    oneofs: boolean; // includes virtual oneof fields set to the present field's name
  };

  constructor() {
    super();
    this.root = this.loadSync(PROTO_PATH);

    this.HeroBanner = this.root.lookupType('slides.HeroSlidesResponse');
    this.PromoBanner = this.root.lookupType('slides.PromoBannerResponse');

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
   * @param {HeroSlide[]} sliders
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodeHeroBanner = (
    sliders: HeroSlide[]
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
   * @param {PromoBanner} banner
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodePromoBanner = (
    banner: PromoBanner
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
