import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema(
  {
    key: {
      type: Number,
      required: true,
      index: { unique: true }, // storeId:id
    },
    slug: {
      type: String,
      required: true,
      index: { unique: true }, // storeId:slug
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
    size: {
      type: String,
    },
    expireAt: {
      type: Date,
      expires: 60 * 60 * 24, // 1 day
      default: Date.now,
    },
  },
  { collection: 'Products' }
);

export default mongoose.model('Products', Product);
