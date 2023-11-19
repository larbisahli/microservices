// Original file: src/proto/product.proto

import type {
  Product as _product_Product,
  Product__Output as _product_Product__Output,
} from '../product/Product';

export interface ProductsResponse {
  products?: _product_Product[];
}

export interface ProductsResponse__Output {
  products: _product_Product__Output[];
}
