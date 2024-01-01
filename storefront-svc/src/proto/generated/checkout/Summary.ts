// Original file: src/proto/checkout.proto

import type {
  FinalPrice as _checkout_FinalPrice,
  FinalPrice__Output as _checkout_FinalPrice__Output,
} from '../checkout/FinalPrice';
import type {
  Discount as _checkout_Discount,
  Discount__Output as _checkout_Discount__Output,
} from '../checkout/Discount';

export interface Summary {
  grandTotal?: _checkout_FinalPrice | null;
  subtotalIncludingTax?: _checkout_FinalPrice | null;
  subtotalExcludingTax?: _checkout_FinalPrice | null;
  subtotalWithDiscountExcludingTax?: _checkout_FinalPrice | null;
  totalShippingCost?: _checkout_FinalPrice | null;
  discount?: _checkout_Discount | null;
}

export interface Summary__Output {
  grandTotal: _checkout_FinalPrice__Output | null;
  subtotalIncludingTax: _checkout_FinalPrice__Output | null;
  subtotalExcludingTax: _checkout_FinalPrice__Output | null;
  subtotalWithDiscountExcludingTax: _checkout_FinalPrice__Output | null;
  totalShippingCost: _checkout_FinalPrice__Output | null;
  discount: _checkout_Discount__Output | null;
}
