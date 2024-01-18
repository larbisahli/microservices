// Original file: src/proto/checkout.proto

export interface AppliedCoupon {
  code?: string;
  discountValue?: number | string;
  discountType?: string;
}

export interface AppliedCoupon__Output {
  code: string;
  discountValue: number;
  discountType: string;
}
