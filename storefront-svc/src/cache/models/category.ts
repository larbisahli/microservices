import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategoryCache = new Schema(
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
    name: {
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
      expires: 60 * 60 * 24 * 7, // 7 day
      default: Date.now,
    },
  },
  { collection: 'Category' }
);

export default mongoose.model('Category', CategoryCache);
