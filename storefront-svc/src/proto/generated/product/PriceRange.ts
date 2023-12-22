// Original file: src/proto/product.proto

import type {
  Price as _product_Price,
  Price__Output as _product_Price__Output,
} from '../product/Price';

export interface PriceRange {
  maximumPrice?: _product_Price | null;
  minimumPrice?: _product_Price | null;
}

export interface PriceRange__Output {
  maximumPrice: _product_Price__Output | null;
  minimumPrice: _product_Price__Output | null;
}
