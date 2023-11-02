// Original file: src/proto/category.proto

import type {
  Image as _photoPackage_Image,
  Image__Output as _photoPackage_Image__Output,
} from '../photoPackage/Image';
import type {
  Breadcrumbs as _categoryPackage_Breadcrumbs,
  Breadcrumbs__Output as _categoryPackage_Breadcrumbs__Output,
} from '../categoryPackage/Breadcrumbs';

export interface CategorySeo {
  urlKey?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  metaRobots?: string;
  breadcrumbsPriority?: number;
  metaImage?: _photoPackage_Image[];
  breadcrumbs?: _categoryPackage_Breadcrumbs[];
}

export interface CategorySeo__Output {
  urlKey: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  metaRobots: string;
  breadcrumbsPriority: number;
  metaImage: _photoPackage_Image__Output[];
  breadcrumbs: _categoryPackage_Breadcrumbs__Output[];
}
