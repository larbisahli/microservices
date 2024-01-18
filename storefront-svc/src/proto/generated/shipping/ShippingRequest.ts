// Original file: src/proto/shipping.proto

export interface ShippingRequest {
  alias?: string;
  storeId?: string;
  _storeId?: 'storeId';
}

export interface ShippingRequest__Output {
  alias: string;
  storeId?: string;
  _storeId: 'storeId';
}
