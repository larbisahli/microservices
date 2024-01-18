// Original file: src/proto/payment.proto

export interface StipePaymentRequest {
  alias?: string;
  storeId?: string;
  _storeId?: 'storeId';
}

export interface StipePaymentRequest__Output {
  alias: string;
  storeId?: string;
  _storeId: 'storeId';
}
