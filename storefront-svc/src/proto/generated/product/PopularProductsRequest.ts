// Original file: src/proto/product.proto

export interface PopularProductsRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  _suid?: 'suid';
}

export interface PopularProductsRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  _suid: 'suid';
}
