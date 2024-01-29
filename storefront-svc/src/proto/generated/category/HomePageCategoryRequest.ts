// Original file: src/proto/category.proto

export interface HomePageCategoryRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  _suid?: 'suid';
}

export interface HomePageCategoryRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  _suid: 'suid';
}
