// Original file: src/proto/slides.proto

export interface PromoBannerRequest {
  alias?: string;
  storeLanguageId?: number;
  storeId?: string;
  _storeId?: 'storeId';
}

export interface PromoBannerRequest__Output {
  alias: string;
  storeLanguageId: number;
  storeId?: string;
  _storeId: 'storeId';
}
