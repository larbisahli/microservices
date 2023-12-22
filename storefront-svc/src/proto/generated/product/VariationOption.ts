// Original file: src/proto/product.proto

import type {
  Image as _media_Image,
  Image__Output as _media_Image__Output,
} from '../media/Image';
import type {
  Price as _product_Price,
  Price__Output as _product_Price__Output,
} from '../product/Price';

export interface VariationOption {
  id?: number;
  title?: string;
  thumbnail?: _media_Image[];
  options?: number[];
  price?: _product_Price | null;
  quantity?: number;
  sku?: string;
}

export interface VariationOption__Output {
  id: number;
  title: string;
  thumbnail: _media_Image__Output[];
  options: number[];
  price: _product_Price__Output | null;
  quantity: number;
  sku: string;
}
