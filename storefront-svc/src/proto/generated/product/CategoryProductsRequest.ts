// Original file: src/proto/product.proto

export interface CategoryProductsRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  urlKey?: string;
  page?: number;
  _suid?: 'suid';
}

export interface CategoryProductsRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  urlKey: string;
  page: number;
  _suid: 'suid';
}
