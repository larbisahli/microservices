/**
 * This package helps us encode and decode resources to a binary blob (Uint8Array)
 */
import { Language } from '@proto/generated/language/Language';
import protobuf from 'protobufjs';
import { Service } from 'typedi';

const PROTO_PATH = './dist/proto/language.proto';

@Service()
export default class LanguagePackage extends protobuf.Root {
  root: protobuf.Root;
  Language: protobuf.Type;
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
    this.Language = this.root.lookupType('language.LanguageResponse');
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
   * @param {Settings} language
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encode = (
    language: Language
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Language.verify(language);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.Language.create({ language });
        // Encode the message to a buffer
        const buffer = this.Language.encode(message).finish();
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
        const language = this.Language.toObject(
          this.Language.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: language });
      } catch (error) {
        reject({ error });
      }
    });
  };
}
