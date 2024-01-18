// Original file: src/proto/checkout.proto

export interface CheckoutRequest {
  alias?: string;
  storeLanguageId?: number;
  cuid?: string;
}

export interface CheckoutRequest__Output {
  alias: string;
  storeLanguageId: number;
  cuid: string;
}
