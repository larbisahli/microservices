// Original file: src/proto/checkout.proto

import type {
  FinalPrice as _checkout_FinalPrice,
  FinalPrice__Output as _checkout_FinalPrice__Output,
} from '../checkout/FinalPrice';

export interface Summary {
  grandInclTotal?: _checkout_FinalPrice | null;
  grandExclTotal?: _checkout_FinalPrice | null;
  subtotalInclTax?: _checkout_FinalPrice | null;
  subtotalExclTax?: _checkout_FinalPrice | null;
  subtotalWithDiscount?: _checkout_FinalPrice | null;
  totalShippingInclCost?: _checkout_FinalPrice | null;
  totalShippingExclCost?: _checkout_FinalPrice | null;
}

export interface Summary__Output {
  grandInclTotal: _checkout_FinalPrice__Output | null;
  grandExclTotal: _checkout_FinalPrice__Output | null;
  subtotalInclTax: _checkout_FinalPrice__Output | null;
  subtotalExclTax: _checkout_FinalPrice__Output | null;
  subtotalWithDiscount: _checkout_FinalPrice__Output | null;
  totalShippingInclCost: _checkout_FinalPrice__Output | null;
  totalShippingExclCost: _checkout_FinalPrice__Output | null;
}
