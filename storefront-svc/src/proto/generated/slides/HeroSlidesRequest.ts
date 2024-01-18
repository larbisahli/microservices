// Original file: src/proto/slides.proto

export interface HeroSlidesRequest {
  alias?: string;
  storeLanguageId?: number;
  storeId?: string;
  _storeId?: 'storeId';
}

export interface HeroSlidesRequest__Output {
  alias: string;
  storeLanguageId: number;
  storeId?: string;
  _storeId: 'storeId';
}
