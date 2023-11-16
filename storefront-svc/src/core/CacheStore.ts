import { assert } from 'console';
import {
  Collection,
  MongoClient,
  MongoClientOptions,
  WriteConcernSettings,
} from 'mongodb';
import Debug from 'debug';
import byteSize from 'byte-size';
import { MongoDBConfig } from '@config';
import { Service } from 'typedi';
import crypto from 'crypto';

const debug = Debug('cache-store');

export type CacheStoreOptions = {
  mongoUrl?: string;
  mongoOptions?: MongoClientOptions;
  dbName?: string;
  ttl?: number; // in seconds
  writeOperationOptions?: WriteConcernSettings;
};

interface InternalCacheType<T> {
  _id: string;
  expires?: Date;
  expireAfterSeconds?: Date;
  data: T;
  resourceName?: string;
  packageName?: string;
  page?: number | null;
  size?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

@Service()
export default class CacheStore {
  private client: Promise<MongoClient>;
  private options: CacheStoreOptions;

  constructor() {
    debug('create cache mongo store instance');
    const options: CacheStoreOptions = {
      ttl: 24 * 60 * 60,
      mongoUrl: MongoDBConfig.url,
      dbName: 'admin-cache',
      mongoOptions: {
        maxPoolSize: 10,
        minPoolSize: 1,
      },
    };

    // Check params
    assert(options.mongoUrl, 'You must provide either mongoUrl in options');

    let _client: Promise<MongoClient>;
    if (options.mongoUrl) {
      _client = MongoClient.connect(options.mongoUrl, options.mongoOptions);
    } else {
      throw new Error('Cannot init client. Please provide correct options');
    }

    assert(!!_client, 'Client is null|undefined');

    this.client = _client;
    this.options = options;
  }

  /**
   * Return collection or create one if not exist
   * @param {string} collectionName
   * @returns {Promise<Collection<InternalCacheType>>}
   */
  private async getClientCollection<T>(
    collectionName: string
  ): Promise<Collection<InternalCacheType<T>>> {
    return this.client.then(async (con) => {
      const collection = con
        .db(this.options.dbName)
        .collection<InternalCacheType<T>>(collectionName);
      return collection;
    });
  }

  private getId(name: string, storeId: string, values: any) {
    return crypto
      .createHash('sha256')
      .update(`${storeId}:${name}:${JSON.stringify(values)}`)
      .digest('hex');
  }

  /**
   *  Get a resource from the store given an ID.
   * @param _id resource ID
   */
  get<T>(
    collectionName: string,
    values: any,
    context: any
  ): Promise<InternalCacheType<T>> {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          req: {
            store: { id: storeId },
          },
          info: { fieldName },
        } = context;
        const _id = this.getId(fieldName, storeId, values);
        const collection = await this.getClientCollection(collectionName);
        const resource = await collection.findOne({
          _id,
          $or: [
            { expires: { $exists: false } },
            { expires: { $gt: new Date() } },
          ],
        });
        resolve(resource as InternalCacheType<T>);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Upsert a resource into the store given an ID and resource object.
   * @param _id resource ID
   */
  set<T>(collectionName: string, data: T, values: any, context: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          req: {
            store: { id: storeId },
          },
          info: { fieldName },
        } = context;
        const _id = this.getId(fieldName, storeId, values);

        // Store the serialized data as a Binary object
        const byteLength = Buffer.byteLength(JSON.stringify(data));

        // Calculate the data size for future inspection (mongodb doc max size is 16MB)
        const { value, unit } = byteSize(byteLength, {
          precision: 2,
        });

        const s: InternalCacheType<T> = {
          _id,
          data,
          size: `${value} ${unit}`,
        };

        // Expire handling
        s.expires = new Date(Date.now() + this.options.ttl! * 1000);
        s.expireAfterSeconds = new Date(Date.now() + this.options.ttl! * 1000);

        const collection = await this.getClientCollection(collectionName);

        await collection.updateOne(
          { _id: s._id },
          { $set: s },
          {
            upsert: true,
            writeConcern: this.options.writeOperationOptions,
          }
        );
      } catch (error) {
        return reject(error);
      }
      return resolve(null);
    });
  }

  /**
   * Expire handling, extend the expiration time if the data is accessed frequently
   */
  extendExpiryDate(collectionName: string, _id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        debug(`CacheStore#extendExpiryDate=${_id}`);

        const collection = await this.getClientCollection(collectionName);

        await collection.updateOne(
          { _id },
          {
            $set: { expires: new Date(Date.now() + this.options.ttl! * 1000) },
          },
          {
            writeConcern: this.options.writeOperationOptions,
          }
        );
      } catch (error) {
        return reject(error);
      }
      return resolve(null);
    });
  }

  /**
   * Destroy/delete a resource from the store given an ID
   * @param _id resource ID
   */
  async destroy(
    collectionName: string,
    _id: string,
    callback: (err: any) => void = noop
  ): Promise<void> {
    debug(`CacheStore#destroy=${_id}`);
    await this.getClientCollection(collectionName)
      .then((collection) =>
        collection.deleteOne(
          { _id },
          { writeConcern: this.options.writeOperationOptions }
        )
      )
      .then(() => {
        callback(null);
      })
      .catch((err) => callback(err));
  }

  /**
   * Get the count of all resources in the store
   */
  async length(collectionName: string): Promise<number> {
    debug('CacheStore#length()');
    const collection = await this.getClientCollection(collectionName);
    return collection.countDocuments();
  }

  /**
   * Delete all resources from the store.
   */
  async clear(collectionName: string) {
    const collection = await this.getClientCollection(collectionName);
    collection.drop();
  }

  /**
   * Close database connection
   */
  close(): Promise<void> {
    debug('CacheStore#close()');
    return this.client.then((c) => c.close());
  }
}
