// Original file: src/proto/checkout.proto

import type {
  Cart as _cart_Cart,
  Cart__Output as _cart_Cart__Output,
} from '../cart/Cart';
import type {
  ShippingAddress as _checkout_ShippingAddress,
  ShippingAddress__Output as _checkout_ShippingAddress__Output,
} from '../checkout/ShippingAddress';
import type {
  Shipments as _checkout_Shipments,
  Shipments__Output as _checkout_Shipments__Output,
} from '../checkout/Shipments';
import type {
  PaymentConfiguration as _checkout_PaymentConfiguration,
  PaymentConfiguration__Output as _checkout_PaymentConfiguration__Output,
} from '../checkout/PaymentConfiguration';
import type {
  Summary as _checkout_Summary,
  Summary__Output as _checkout_Summary__Output,
} from '../checkout/Summary';
import type {
  Metadata as _checkout_Metadata,
  Metadata__Output as _checkout_Metadata__Output,
} from '../checkout/Metadata';
import type {
  StepsConfig as _checkout_StepsConfig,
  StepsConfig__Output as _checkout_StepsConfig__Output,
} from '../checkout/StepsConfig';
import type {
  AppliedCoupon as _checkout_AppliedCoupon,
  AppliedCoupon__Output as _checkout_AppliedCoupon__Output,
} from '../checkout/AppliedCoupon';
import type {
  Tax as _checkout_Tax,
  Tax__Output as _checkout_Tax__Output,
} from '../checkout/Tax';
import type {
  Timestamp as _google_protobuf_Timestamp,
  Timestamp__Output as _google_protobuf_Timestamp__Output,
} from '../google/protobuf/Timestamp';

export interface Checkout {
  cartId?: string;
  storeId?: string;
  email?: string;
  cart?: _cart_Cart | null;
  shippingAddress?: _checkout_ShippingAddress | null;
  shipments?: _checkout_Shipments | null;
  paymentConfiguration?: _checkout_PaymentConfiguration | null;
  summary?: _checkout_Summary | null;
  metadata?: _checkout_Metadata | null;
  stepsConfig?: _checkout_StepsConfig | null;
  status?: string;
  appliedCoupon?: _checkout_AppliedCoupon | null;
  tax?: _checkout_Tax | null;
  createdAt?: _google_protobuf_Timestamp | null;
  updatedAt?: _google_protobuf_Timestamp | null;
}

export interface Checkout__Output {
  cartId: string;
  storeId: string;
  email: string;
  cart: _cart_Cart__Output | null;
  shippingAddress: _checkout_ShippingAddress__Output | null;
  shipments: _checkout_Shipments__Output | null;
  paymentConfiguration: _checkout_PaymentConfiguration__Output | null;
  summary: _checkout_Summary__Output | null;
  metadata: _checkout_Metadata__Output | null;
  stepsConfig: _checkout_StepsConfig__Output | null;
  status: string;
  appliedCoupon: _checkout_AppliedCoupon__Output | null;
  tax: _checkout_Tax__Output | null;
  createdAt: _google_protobuf_Timestamp__Output | null;
  updatedAt: _google_protobuf_Timestamp__Output | null;
}
