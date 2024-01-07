// Original file: src/proto/checkout.proto

import type {
  Checkout as _checkout_Checkout,
  Checkout__Output as _checkout_Checkout__Output,
} from '../checkout/Checkout';

export interface CheckoutResponse {
  checkout?: _checkout_Checkout | null;
}

export interface CheckoutResponse__Output {
  checkout: _checkout_Checkout__Output | null;
}
