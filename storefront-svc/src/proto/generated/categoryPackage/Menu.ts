// Original file: src/proto/category.proto

import type {
  Image as _photoPackage_Image,
  Image__Output as _photoPackage_Image__Output,
} from '../photoPackage/Image';
import type {
  Menu as _categoryPackage_Menu,
  Menu__Output as _categoryPackage_Menu__Output,
} from '../categoryPackage/Menu';

export interface Menu {
  id?: number;
  name?: string;
  url?: string;
  thumbnail?: _photoPackage_Image[];
  children?: _categoryPackage_Menu[];
}

export interface Menu__Output {
  id: number;
  name: string;
  url: string;
  thumbnail: _photoPackage_Image__Output[];
  children: _categoryPackage_Menu__Output[];
}
