// Original file: src/proto/checkout.proto

export interface CheckoutRequest {
  alias?: string;
  storeLanguageId?: number;
  cuid?: string;
  suid?: string;
  _suid?: 'suid';
}

export interface CheckoutRequest__Output {
  alias: string;
  storeLanguageId: number;
  cuid: string;
  suid?: string;
  _suid: 'suid';
}
