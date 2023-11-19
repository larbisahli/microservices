// Original file: src/proto/page.proto

import type {
  Image as _media_Image,
  Image__Output as _media_Image__Output,
} from '../media/Image';

export interface Page {
  id?: string;
  slug?: string;
  name?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogMedia?: _media_Image[];
}

export interface Page__Output {
  id: string;
  slug: string;
  name: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  ogMedia: _media_Image__Output[];
}
