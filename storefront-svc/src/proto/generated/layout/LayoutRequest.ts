// Original file: src/proto/layout.proto

export interface LayoutRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  page?: string;
  isCustom?: boolean;
  templateId?: string;
  _suid?: 'suid';
}

export interface LayoutRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  page: string;
  isCustom: boolean;
  templateId: string;
  _suid: 'suid';
}
