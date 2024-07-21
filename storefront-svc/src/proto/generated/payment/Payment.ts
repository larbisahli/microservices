// Original file: src/proto/payment.proto

export interface Payment {
  id?: string;
  code?: string;
  type?: string;
  data?: Buffer | Uint8Array | string;
}

export interface Payment__Output {
  id: string;
  code: string;
  type: string;
  data: Buffer;
}
