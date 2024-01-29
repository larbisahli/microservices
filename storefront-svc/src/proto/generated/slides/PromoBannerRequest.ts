// Original file: src/proto/slides.proto

export interface PromoBannerRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  _suid?: 'suid';
}

export interface PromoBannerRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  _suid: 'suid';
}
