// Original file: src/proto/checkout.proto

import type {
  Geo as _checkout_Geo,
  Geo__Output as _checkout_Geo__Output,
} from '../checkout/Geo';

export interface Metadata {
  ip?: string;
  geo?: _checkout_Geo | null;
}

export interface Metadata__Output {
  ip: string;
  geo: _checkout_Geo__Output | null;
}
