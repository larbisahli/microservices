import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Cart = new Schema(
  {
    key: {
      type: String,
      required: true,
      index: { unique: true },
    },
    buffer: {
      type: Buffer,
      required: true,
    },
    alias: {
      type: String,
      required: true,
      index: { unique: false },
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
      expires: 60 * 60 * 24 * 25, // 25 days
      default: Date.now,
    },
  },
  { collection: 'Cart' }
);

export default mongoose.model('Cart', Cart);
