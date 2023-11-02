// Original file: src/proto/page.proto

import type {
  Seo as _CommonPackage_Seo,
  Seo__Output as _CommonPackage_Seo__Output,
} from '../CommonPackage/Seo';

export interface Page {
  id?: string;
  slug?: string;
  name?: string;
  content?: string;
  seo?: _CommonPackage_Seo | null;
}

export interface Page__Output {
  id: string;
  slug: string;
  name: string;
  content: string;
  seo: _CommonPackage_Seo__Output | null;
}
