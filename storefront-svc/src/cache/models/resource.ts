import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ResourceCache = new Schema(
  {
    key: {
      type: String,
      required: true,
      index: { unique: true },
    },
    data: {
      type: Buffer,
      required: true,
    },
    alias: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      require: true,
    },
    name: {
      type: String,
    },
    page: {
      type: Number,
    },
    size: {
      type: String,
    },
    expireAt: {
      type: Date,
      expires: 60 * 60 * 24, // 1 day
      default: Date.now,
    },
  },
  { collection: 'ResourceCache' }
);

export default mongoose.model('ResourceCache', ResourceCache);
