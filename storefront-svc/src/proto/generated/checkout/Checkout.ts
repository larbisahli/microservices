// Original file: src/proto/checkout.proto

import type {
  ShippingAddress as _checkout_ShippingAddress,
  ShippingAddress__Output as _checkout_ShippingAddress__Output,
} from '../checkout/ShippingAddress';
import type {
  Shipment as _checkout_Shipment,
  Shipment__Output as _checkout_Shipment__Output,
} from '../checkout/Shipment';
import type {
  PaymentConfiguration as _checkout_PaymentConfiguration,
  PaymentConfiguration__Output as _checkout_PaymentConfiguration__Output,
} from '../checkout/PaymentConfiguration';
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

export interface Checkout {
  cartId?: string;
  storeId?: string;
  email?: string;
  shippingAddress?: _checkout_ShippingAddress | null;
  shipment?: _checkout_Shipment | null;
  paymentConfiguration?: _checkout_PaymentConfiguration | null;
  metadata?: _checkout_Metadata | null;
  stepsConfig?: _checkout_StepsConfig | null;
  status?: string;
  appliedCoupon?: _checkout_AppliedCoupon | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Checkout__Output {
  cartId: string;
  storeId: string;
  email: string;
  shippingAddress: _checkout_ShippingAddress__Output | null;
  shipment: _checkout_Shipment__Output | null;
  paymentConfiguration: _checkout_PaymentConfiguration__Output | null;
  metadata: _checkout_Metadata__Output | null;
  stepsConfig: _checkout_StepsConfig__Output | null;
  status: string;
  appliedCoupon: _checkout_AppliedCoupon__Output | null;
  createdAt: string;
  updatedAt: string;
}
