// Original file: src/proto/product.proto

import type {
  Image as _media_Image,
  Image__Output as _media_Image__Output,
} from '../media/Image';

export interface ProductSeo {
  id?: number;
  slug?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  metaImage?: _media_Image[];
}

export interface ProductSeo__Output {
  id: number;
  slug: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  metaImage: _media_Image__Output[];
}
