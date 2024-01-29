// Original file: src/proto/category.proto

export interface CategoryRequest {
  urlKey?: string;
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  _suid?: 'suid';
}

export interface CategoryRequest__Output {
  urlKey: string;
  alias: string;
  storeLanguageId: number;
  suid?: string;
  _suid: 'suid';
}
