import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema(
  {
    key: {
      type: Number,
      required: true,
      index: { unique: true }, // product id
    },
    slug: {
      type: String,
      required: true,
      index: { unique: true }, // sha(alias:slug)
    },
    alias: {
      type: String,
      required: true,
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
  { collection: 'Product' }
);

export default mongoose.model('Product', Product);
