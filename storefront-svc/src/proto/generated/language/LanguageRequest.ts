// Original file: src/proto/language.proto

export interface LanguageRequest {
  id?: number;
  alias?: string;
  suid?: string;
  _suid?: 'suid';
}

export interface LanguageRequest__Output {
  id: number;
  alias: string;
  suid?: string;
  _suid: 'suid';
}
