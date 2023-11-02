import { assert } from 'console';
import {
  Collection,
  MongoClient,
  MongoClientOptions,
  WriteConcernSettings,
  Binary,
} from 'mongodb';
import Debug from 'debug';
import cron from 'node-cron';
import Logger from '@core/Logger';
import byteSize, { ByteSizeResult } from 'byte-size';

const debug = Debug('cache-store');

const whiteLisCollections = ['sessions', 'expressRateRecords'];

export type CacheStoreOptions = {
  mongoUrl?: string;
  mongoOptions?: MongoClientOptions;
  dbName?: string;
  ttl?: number; // in seconds
  writeOperationOptions?: WriteConcernSettings;
};

type InternalCacheType = {
  _id: string;
  expires?: Date;
  expireAfterSeconds?: Date;
  buffer: Uint8Array | Binary;
  resourceName: string;
  packageName: string;
  page: number | null;
  size?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export default class CacheStore {
  private client: Promise<MongoClient>;
  private options: CacheStoreOptions;

  constructor({
    ttl = 60 * 60, // = 1 hour. Default
    mongoOptions = {},
    ...required
  }: CacheStoreOptions) {
    debug('create cache mongo store instance');
    const options: CacheStoreOptions = {
      ttl,
      mongoOptions: {
        maxPoolSize: 10,
        minPoolSize: 1,
        ...mongoOptions
      },
      ...required,
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

    cron.schedule('0 0 * * *', () => {
      try {
        this.removeEmptyCollections();
        Logger.system.info(`Cronjob running... | ${new Date()}`);
      } catch (error) {
        Logger.system.error(error);
      }
    });
  }

  /**
   * Return collection or create one if not exist
   * @param {string} collectionName
   * @returns {Promise<Collection<InternalCacheType>>}
   */
  private async getClientCollection(
    collectionName: string
  ): Promise<Collection<InternalCacheType>> {
    return this.client.then(async (con) => {
      const collection = con
        .db(this.options.dbName)
        .collection<InternalCacheType>(collectionName);
      return collection;
    });
  }

  /**
   * Check for empty collections and remove them, cronjob every 24h
   */
  private async removeEmptyCollections() {
    this.client.then(async (con) => {
      const cursor = con
        .db(this.options.dbName)
        .listCollections({}, { nameOnly: true });

      while (await cursor.hasNext()) {
        const collection = await cursor.next();
        const name = collection?.name;
        if (!name) {
          Logger.system.error(
            `cronRemoveCollections Error got empty collection name ${JSON.stringify(
              { collection }
            )}`
          );
          break; // we don't want infinit loop in case something wrong
        }

        // Get the collection length
        const len = await this.length(collection?.name);

        if (len === 0 && !whiteLisCollections.includes(name)) {
          await con.db(this.options.dbName).collection(name).drop();
          console.log(`==>> Dropped empty collection >> ${name}`);
        }

        if (!(await cursor.hasNext())) {
          Logger.system.info(`Cronjob Done | ${new Date()}`);
        }
      }
    });
  }

  /**
   *  Get a resource from the store given an ID.
   * @param _id resource ID
   */
  get(alias: string, _id: string): Promise<InternalCacheType> {
    return new Promise(async (resolve, reject) => {
      try {
        debug(`CacheStore#get=${_id}`);

        const collection = await this.getClientCollection(alias);
        const resource = await collection.findOne({
          _id,
          $or: [
            { expires: { $exists: false } },
            { expires: { $gt: new Date() } },
          ],
        });
        resolve(resource as InternalCacheType);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Upsert a resource into the store given an ID and resource object.
   * @param _id resource ID
   */
  set(alias: string, resource: InternalCacheType) {
    return new Promise(async (resolve, reject) => {
      try {
        debug(`CacheStore#set=${{ alias, _id: resource._id }}`);

        // Store the serialized data as a Binary object
        const binaryData = new Binary(resource.buffer as Uint8Array);

        // Calculate the data size for future inspection (mongodb doc max size is 16MB)
        const { value, unit } = byteSize(binaryData?.length(), {
          precision: 2,
        });

        const s: InternalCacheType = {
          ...resource,
          buffer: binaryData,
          size: `${value} ${unit}`,
        };

        // Expire handling
        s.expires = new Date(Date.now() + this.options.ttl! * 1000);
        s.expireAfterSeconds = new Date(Date.now() + this.options.ttl! * 1000);

        const collection = await this.getClientCollection(alias);

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
  extendExpiryDate(alias: string, _id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        debug(`CacheStore#extendExpiryDate=${_id}`);

        const collection = await this.getClientCollection(alias);

        await collection.updateOne(
          { _id },
          {
            $set: {
              expires: new Date(Date.now() + this.options.ttl! * 1000),
              expireAfterSeconds: new Date(Date.now() + this.options.ttl! * 1000)
            },
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
    alias: string,
    _id: string,
    callback: (err: any) => void = noop
  ): Promise<void> {
    debug(`CacheStore#destroy=${_id}`);
    await this.getClientCollection(alias)
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
  async length(alias: string): Promise<number> {
    debug('CacheStore#length()');
    const collection = await this.getClientCollection(alias);
    return collection.countDocuments();
  }

  /**
   * Delete all resources from the store.
   */
  async clear(alias: string) {
    debug('CacheStore#clear()');
    const collection = await this.getClientCollection(alias);
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
