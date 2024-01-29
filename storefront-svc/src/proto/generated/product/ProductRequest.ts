// Original file: src/proto/product.proto

export interface ProductRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  slug?: string;
  _suid?: 'suid';
}

export interface ProductRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  slug: string;
  _suid: 'suid';
}
