// Original file: src/proto/product.proto

import type { Unit as _product_Unit, Unit__Output as _product_Unit__Output } from '../product/Unit';

export interface ProductShippingInfo {
  'id'?: (number);
  'weight'?: (number);
  'weightUnit'?: (_product_Unit | null);
  'volume'?: (number);
  'volumeUnit'?: (_product_Unit | null);
  'dimensionWidth'?: (number);
  'dimensionHeight'?: (number);
  'dimensionLenght'?: (number);
  'dimensionUnit'?: (_product_Unit | null);
}

export interface ProductShippingInfo__Output {
  'id': (number);
  'weight': (number);
  'weightUnit': (_product_Unit__Output | null);
  'volume': (number);
  'volumeUnit': (_product_Unit__Output | null);
  'dimensionWidth': (number);
  'dimensionHeight': (number);
  'dimensionLenght': (number);
  'dimensionUnit': (_product_Unit__Output | null);
}
