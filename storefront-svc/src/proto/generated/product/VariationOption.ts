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
  salePrice?: number | string;
  comparePrice?: number | string;
  quantity?: number;
  sku?: string;
}

export interface VariationOption__Output {
  id: number;
  title: string;
  thumbnail: _media_Image__Output[];
  options: number[];
  salePrice: number;
  comparePrice: number;
  quantity: number;
  sku: string;
}
