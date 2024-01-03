// Original file: src/proto/cart.proto

import type {
  Image as _media_Image,
  Image__Output as _media_Image__Output,
} from '../media/Image';
import type {
  VariationOption as _product_VariationOption,
  VariationOption__Output as _product_VariationOption__Output,
} from '../product/VariationOption';

export interface Item {
  id?: number;
  name?: string;
  sku?: string;
  type?: string;
  thumbnail?: _media_Image[];
  quantity?: number;
  orderQuantity?: number;
  orderVariationOption?: _product_VariationOption | null;
  key?: string;
  salePrice?: number | string;
  comparePrice?: number | string;
}

export interface Item__Output {
  id: number;
  name: string;
  sku: string;
  type: string;
  thumbnail: _media_Image__Output[];
  quantity: number;
  orderQuantity: number;
  orderVariationOption: _product_VariationOption__Output | null;
  key: string;
  salePrice: number;
  comparePrice: number;
}
