// Original file: src/proto/payment.proto

import type {
  Payment as _payment_Payment,
  Payment__Output as _payment_Payment__Output,
} from '../payment/Payment';

export interface PaymentResponse {
  payments?: _payment_Payment[];
}

export interface PaymentResponse__Output {
  payments: _payment_Payment__Output[];
}
