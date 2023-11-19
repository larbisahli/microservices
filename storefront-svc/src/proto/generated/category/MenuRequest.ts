// Original file: src/proto/category.proto

export interface MenuRequest {
  alias?: string;
  storeLanguageId?: number;
  storeId?: string;
  _storeId?: 'storeId';
}

export interface MenuRequest__Output {
  alias: string;
  storeLanguageId: number;
  storeId?: string;
  _storeId: 'storeId';
}
