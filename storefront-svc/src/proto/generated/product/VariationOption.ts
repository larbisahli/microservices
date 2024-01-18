// Original file: src/proto/product.proto

import type {
  Image as _media_Image,
  Image__Output as _media_Image__Output,
} from '../media/Image';

export interface VariationOption {
  id?: number;
  title?: string;
  thumbnail?: _media_Image[];
  options?: number[];
  quantity?: number;
  sku?: string;
  salePrice?: number | string;
  comparePrice?: number | string;
}

export interface VariationOption__Output {
  id: number;
  title: string;
  thumbnail: _media_Image__Output[];
  options: number[];
  quantity: number;
  sku: string;
  salePrice: number;
  comparePrice: number;
}
