import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ConfigCache = new Schema(
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
  { collection: 'Config' }
);

export default mongoose.model('Config', ConfigCache);
