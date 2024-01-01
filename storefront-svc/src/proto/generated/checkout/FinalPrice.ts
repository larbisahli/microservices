// Original file: src/proto/checkout.proto

import type {
  Currency as _commons_Currency,
  Currency__Output as _commons_Currency__Output,
} from '../commons/Currency';

export interface FinalPrice {
  currency?: _commons_Currency | null;
  value?: number | string;
}

export interface FinalPrice__Output {
  currency: _commons_Currency__Output | null;
  value: number;
}
