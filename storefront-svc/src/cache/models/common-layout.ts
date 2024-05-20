import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommonLayoutCache = new Schema(
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
    templateId: {
      type: String,
      require: true,
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
  { collection: 'common-layout' }
);

export default mongoose.model('common-layout', CommonLayoutCache);
