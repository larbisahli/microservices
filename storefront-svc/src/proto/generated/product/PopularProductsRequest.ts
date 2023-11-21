// Original file: src/proto/product.proto

export interface PopularProductsRequest {
  alias?: string;
  storeLanguageId?: number;
  storeId?: string;
  _storeId?: 'storeId';
}

export interface PopularProductsRequest__Output {
  alias: string;
  storeLanguageId: number;
  storeId?: string;
  _storeId: 'storeId';
}
