// Original file: src/proto/cart.proto

import type {
  FinalPrice as _checkout_FinalPrice,
  FinalPrice__Output as _checkout_FinalPrice__Output,
} from '../checkout/FinalPrice';

export interface Total {
  totalPrice?: _checkout_FinalPrice | null;
  totalExclTax?: _checkout_FinalPrice | null;
}

export interface Total__Output {
  totalPrice: _checkout_FinalPrice__Output | null;
  totalExclTax: _checkout_FinalPrice__Output | null;
}
