// Original file: src/proto/product.proto

import type {
  FinalPrice as _product_FinalPrice,
  FinalPrice__Output as _product_FinalPrice__Output,
} from '../product/FinalPrice';
import type {
  Discount as _product_Discount,
  Discount__Output as _product_Discount__Output,
} from '../product/Discount';

export interface Price {
  finalPrice?: _product_FinalPrice | null;
  finalPriceExclTax?: _product_FinalPrice | null;
  discount?: _product_Discount | null;
}

export interface Price__Output {
  finalPrice: _product_FinalPrice__Output | null;
  finalPriceExclTax: _product_FinalPrice__Output | null;
  discount: _product_Discount__Output | null;
}
