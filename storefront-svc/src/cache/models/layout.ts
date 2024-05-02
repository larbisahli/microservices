import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LayoutCache = new Schema(
  {
    key: {
      type: String,
      required: true,
      index: { unique: true },
    },
    storeId: {
      type: String,
      require: true,
      index: { unique: false },
    },
    localeId: {
      type: String,
      require: true,
      index: { unique: false },
    },
    page: {
      type: String,
      require: true,
      index: { unique: false },
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
      expires: 60 * 60 * 24 * 7, // 7 day
      default: Date.now,
    },
  },
  { collection: 'layout' }
);

export default mongoose.model('layout', LayoutCache);
