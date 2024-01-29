// Original file: src/proto/category.proto

export interface MenuRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  _suid?: 'suid';
}

export interface MenuRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  _suid: 'suid';
}
