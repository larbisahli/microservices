// Original file: src/proto/page.proto

export interface PageRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  slug?: string;
  _suid?: 'suid';
}

export interface PageRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  slug: string;
  _suid: 'suid';
}
