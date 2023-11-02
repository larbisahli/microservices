/**
 * This package helps us encode and decode resources to a binary blob (Uint8Array)
 */
import { Settings } from '@proto/generated/SettingsPackage/Settings';
import protobuf from 'protobufjs';
import { Service } from 'typedi';

const PROTO_PATH = './build/proto/settings.proto';

@Service()
export default class ConfigPackage extends protobuf.Root {
  root: protobuf.Root;
  Config: protobuf.Type;
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
    this.Config = this.root.lookupType('SettingsPackage.StoreConfigResponse');
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
  public encodeConfig = (
    config: Settings
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Config.verify(config);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.Config.create({ config });
        // Encode the message to a buffer
        const buffer = this.Config.encode(message).finish();
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
  public decodeConfig = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const config = this.Config.toObject(
          this.Config.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: config });
      } catch (error) {
        reject({ error });
      }
    });
  };
}
