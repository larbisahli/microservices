// Original file: src/proto/product.proto

import type {
  Image as _photoPackage_Image,
  Image__Output as _photoPackage_Image__Output,
} from '../photoPackage/Image';

export interface VariationOption {
  id?: number;
  title?: string;
  thumbnail?: _photoPackage_Image[];
  options?: number[];
  salePrice?: number | string;
  comparePrice?: number | string;
  quantity?: number;
  sku?: string;
}

export interface VariationOption__Output {
  id: number;
  title: string;
  thumbnail: _photoPackage_Image__Output[];
  options: number[];
  salePrice: number;
  comparePrice: number;
  quantity: number;
  sku: string;
}
