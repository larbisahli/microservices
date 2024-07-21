// Original file: src/proto/payment.proto

export interface PaymentRequest {
  alias?: string;
  suid?: string;
  _suid?: 'suid';
}

export interface PaymentRequest__Output {
  alias: string;
  suid?: string;
  _suid: 'suid';
}
