// Original file: src/proto/payment.proto

import type { Stripe as _payment_Stripe, Stripe__Output as _payment_Stripe__Output } from '../payment/Stripe';

export interface StipePaymentResponse {
  'results'?: (_payment_Stripe | null);
}

export interface StipePaymentResponse__Output {
  'results': (_payment_Stripe__Output | null);
}
