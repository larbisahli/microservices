// Original file: src/proto/category.proto

import type {
  Image as _photoPackage_Image,
  Image__Output as _photoPackage_Image__Output,
} from '../photoPackage/Image';
import type {
  Category as _categoryPackage_Category,
  Category__Output as _categoryPackage_Category__Output,
} from '../categoryPackage/Category';
import type {
  CategorySeo as _categoryPackage_CategorySeo,
  CategorySeo__Output as _categoryPackage_CategorySeo__Output,
} from '../categoryPackage/CategorySeo';

export interface Category {
  id?: number;
  name?: string;
  parentId?: number;
  description?: string;
  thumbnail?: _photoPackage_Image[];
  active?: boolean;
  level?: number;
  position?: number;
  includeInMenu?: boolean;
  hasChildren?: boolean;
  children?: _categoryPackage_Category[];
  categorySeo?: _categoryPackage_CategorySeo | null;
}

export interface Category__Output {
  id: number;
  name: string;
  parentId: number;
  description: string;
  thumbnail: _photoPackage_Image__Output[];
  active: boolean;
  level: number;
  position: number;
  includeInMenu: boolean;
  hasChildren: boolean;
  children: _categoryPackage_Category__Output[];
  categorySeo: _categoryPackage_CategorySeo__Output | null;
}
