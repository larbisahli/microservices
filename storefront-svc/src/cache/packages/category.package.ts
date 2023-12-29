/**
 * This package helps us encode and decode resources to a binary blob (Uint8Array)
 */
import { Category } from '@proto/generated/category/Category';
import { Menu } from '@proto/generated/category/Menu';
import protobuf from 'protobufjs';
import { Service } from 'typedi';

const PROTO_PATH = './dist/proto/category.proto';

@Service()
export default class CategoryPackage extends protobuf.Root {
  root: protobuf.Root;
  Menu: protobuf.Type;
  Category: protobuf.Type;
  HomePageCategories: protobuf.Type;
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
    this.Menu = this.root.lookupType('category.MenuResponse');
    this.Category = this.root.lookupType('category.CategoryResponse');
    this.HomePageCategories = this.root.lookupType(
      'category.HomePageCategoryResponse'
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
   * @param {Menu[]} menu
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodeMenu = (
    menu: Menu[]
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Menu.verify(menu);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.Menu.create({ menu });
        // Encode the message to a buffer
        const buffer = this.Menu.encode(message).finish();
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
  public decodeMenu = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const menu = this.Menu.toObject(
          this.Menu.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: menu });
      } catch (error) {
        reject({ error });
      }
    });
  };

  /**
   * @param {Category[]} category
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodeCategory = (
    category: Category
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.Category.verify(category);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.Category.create({ category });
        // Encode the message to a buffer
        const buffer = this.Category.encode(message).finish();
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
  public decodeCategory = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const category = this.Category.toObject(
          this.Category.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: category });
      } catch (error) {
        reject({ error });
      }
    });
  };

  // -----------------------------

  /**
   * @param {Category[]} category
   * @returns {Promise<{ buffer: Uint8Array; error?: unknown }>}
   */
  public encodeHomepageCategories = (
    categories: Category
  ): Promise<{ buffer: Uint8Array; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const errMsg = this.HomePageCategories.verify(categories);
        if (errMsg) {
          reject(errMsg);
        }
        const message = this.HomePageCategories.create({ categories });
        // Encode the message to a buffer
        const buffer = this.HomePageCategories.encode(message).finish();
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
  public decodeHomepageCategories = (
    buffer: protobuf.Buffer
  ): Promise<{ resource: any; error?: unknown }> => {
    return new Promise((resolve, reject) => {
      try {
        const categories = this.HomePageCategories.toObject(
          this.HomePageCategories.decode(buffer),
          this.decodeOptions
        );
        resolve({ resource: categories });
      } catch (error) {
        reject({ error });
      }
    });
  };
}
