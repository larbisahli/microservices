// Original file: src/proto/product.proto

import type {
  Image as _photoPackage_Image,
  Image__Output as _photoPackage_Image__Output,
} from '../photoPackage/Image';

export interface ProductSeo {
  id?: number;
  slug?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  metaImage?: _photoPackage_Image[];
}

export interface ProductSeo__Output {
  id: number;
  slug: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  metaImage: _photoPackage_Image__Output[];
}
