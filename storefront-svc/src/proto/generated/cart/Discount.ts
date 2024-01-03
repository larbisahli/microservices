// Original file: src/proto/cart.proto

import type {
  FinalPrice as _checkout_FinalPrice,
  FinalPrice__Output as _checkout_FinalPrice__Output,
} from '../checkout/FinalPrice';

export interface Discount {
  label?: string;
  amount?: _checkout_FinalPrice | null;
}

export interface Discount__Output {
  label: string;
  amount: _checkout_FinalPrice__Output | null;
}
