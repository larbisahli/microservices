// Original file: src/proto/checkout.proto

import type {
  FinalPrice as _checkout_FinalPrice,
  FinalPrice__Output as _checkout_FinalPrice__Output,
} from '../checkout/FinalPrice';

export interface Tax {
  label?: string;
  percent?: number | string;
  amount?: _checkout_FinalPrice | null;
}

export interface Tax__Output {
  label: string;
  percent: number;
  amount: _checkout_FinalPrice__Output | null;
}
