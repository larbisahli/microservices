// Original file: src/proto/layout.proto

export interface LayoutRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  page?: string;
  _suid?: 'suid';
  _page?: 'page';
}

export interface LayoutRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  page?: string;
  _suid: 'suid';
  _page: 'page';
}
