// Original file: src/proto/language.proto

import type {
  Translation as _language_Translation,
  Translation__Output as _language_Translation__Output,
} from '../language/Translation';

export interface Language {
  id?: number;
  name?: string;
  isDefault?: boolean;
  localeId?: string;
  direction?: string;
  translation?: _language_Translation | null;
}

export interface Language__Output {
  id: number;
  name: string;
  isDefault: boolean;
  localeId: string;
  direction: string;
  translation: _language_Translation__Output | null;
}
