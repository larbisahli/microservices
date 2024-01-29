// Original file: src/proto/cart.proto

export interface CartRequest {
  alias?: string;
  storeLanguageId?: number;
  cuid?: string;
  suid?: string;
  _suid?: 'suid';
}

export interface CartRequest__Output {
  alias: string;
  storeLanguageId: number;
  cuid: string;
  suid?: string;
  _suid: 'suid';
}
