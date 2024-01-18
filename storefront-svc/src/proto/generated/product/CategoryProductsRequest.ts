// Original file: src/proto/product.proto

export interface CategoryProductsRequest {
  alias?: string;
  storeLanguageId?: number;
  storeId?: string;
  urlKey?: string;
  page?: number;
  _storeId?: 'storeId';
}

export interface CategoryProductsRequest__Output {
  alias: string;
  storeLanguageId: number;
  storeId?: string;
  urlKey: string;
  page: number;
  _storeId: 'storeId';
}
