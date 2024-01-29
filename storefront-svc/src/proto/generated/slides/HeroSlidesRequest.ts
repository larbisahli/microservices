// Original file: src/proto/slides.proto

export interface HeroSlidesRequest {
  alias?: string;
  storeLanguageId?: number;
  suid?: string;
  _suid?: 'suid';
}

export interface HeroSlidesRequest__Output {
  alias: string;
  storeLanguageId: number;
  suid?: string;
  _suid: 'suid';
}
