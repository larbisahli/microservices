// Original file: src/proto/category.proto

import type {
  Category as _category_Category,
  Category__Output as _category_Category__Output,
} from '../category/Category';
import type {
  Image as _media_Image,
  Image__Output as _media_Image__Output,
} from '../media/Image';
import type {
  Breadcrumbs as _category_Breadcrumbs,
  Breadcrumbs__Output as _category_Breadcrumbs__Output,
} from '../category/Breadcrumbs';

export interface Category {
  id?: number;
  parentId?: number;
  parent?: _category_Category | null;
  name?: string;
  description?: string;
  thumbnail?: _media_Image[];
  hasChildren?: boolean;
  children?: _category_Category[];
  urlKey?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  metaRobots?: string;
  breadcrumbsPriority?: number;
  metaImage?: _media_Image[];
  breadcrumbs?: _category_Breadcrumbs[];
  _hasChildren?: 'hasChildren';
  _breadcrumbsPriority?: 'breadcrumbsPriority';
}

export interface Category__Output {
  id: number;
  parentId: number;
  parent: _category_Category__Output | null;
  name: string;
  description: string;
  thumbnail: _media_Image__Output[];
  hasChildren?: boolean;
  children: _category_Category__Output[];
  urlKey: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  metaRobots: string;
  breadcrumbsPriority?: number;
  metaImage: _media_Image__Output[];
  breadcrumbs: _category_Breadcrumbs__Output[];
  _hasChildren: 'hasChildren';
  _breadcrumbsPriority: 'breadcrumbsPriority';
}
