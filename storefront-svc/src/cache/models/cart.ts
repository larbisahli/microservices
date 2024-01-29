import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CartCache = new Schema(
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
    data: {
      type: Buffer,
      required: true,
    },
    size: {
      type: String,
    },
    expireAt: {
      type: Date,
      expires: 60 * 60 * 24 * 30, // 30 days
      default: Date.now,
    },
  },
  { collection: 'Cart' }
);

export default mongoose.model('Cart', CartCache);
