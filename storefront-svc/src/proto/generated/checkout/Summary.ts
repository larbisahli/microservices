// Original file: src/proto/checkout.proto

import type {
  FinalPrice as _checkout_FinalPrice,
  FinalPrice__Output as _checkout_FinalPrice__Output,
} from '../checkout/FinalPrice';

export interface Summary {
  grandTotalInclTax?: _checkout_FinalPrice | null;
  grandTotalExclTax?: _checkout_FinalPrice | null;
  subtotalInclTax?: _checkout_FinalPrice | null;
  subtotalExclTax?: _checkout_FinalPrice | null;
  totalDiscount?: _checkout_FinalPrice | null;
  totalShippingInclTax?: _checkout_FinalPrice | null;
  totalShippingExclTax?: _checkout_FinalPrice | null;
}

export interface Summary__Output {
  grandTotalInclTax: _checkout_FinalPrice__Output | null;
  grandTotalExclTax: _checkout_FinalPrice__Output | null;
  subtotalInclTax: _checkout_FinalPrice__Output | null;
  subtotalExclTax: _checkout_FinalPrice__Output | null;
  totalDiscount: _checkout_FinalPrice__Output | null;
  totalShippingInclTax: _checkout_FinalPrice__Output | null;
  totalShippingExclTax: _checkout_FinalPrice__Output | null;
}
