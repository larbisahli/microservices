import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PageCache = new Schema(
  {
    key: {
      type: String,
      required: true,
      index: { unique: true },
    },
    storeId: {
      type: String,
      require: true,
    },
    alias: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    size: {
      type: String,
    },
    expireAt: {
      type: Date,
      expires: 60 * 60 * 7, // 7 day
      default: Date.now,
    },
  },
  { collection: 'Page' }
);

export default mongoose.model('Page', PageCache);
