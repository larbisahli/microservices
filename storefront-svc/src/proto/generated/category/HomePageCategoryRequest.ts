// Original file: src/proto/category.proto

export interface HomePageCategoryRequest {
  alias?: string;
  storeLanguageId?: number;
  storeId?: string;
  _storeId?: 'storeId';
}

export interface HomePageCategoryRequest__Output {
  alias: string;
  storeLanguageId: number;
  storeId?: string;
  _storeId: 'storeId';
}
