// Original file: src/proto/product.proto

import type {
  ProductType as _productPackage_ProductType,
  ProductType__Output as _productPackage_ProductType__Output,
} from '../productPackage/ProductType';
import type {
  Image as _photoPackage_Image,
  Image__Output as _photoPackage_Image__Output,
} from '../photoPackage/Image';
import type {
  Variation as _productPackage_Variation,
  Variation__Output as _productPackage_Variation__Output,
} from '../productPackage/Variation';
import type {
  VariationOption as _productPackage_VariationOption,
  VariationOption__Output as _productPackage_VariationOption__Output,
} from '../productPackage/VariationOption';
import type {
  ProductShippingInfo as _productPackage_ProductShippingInfo,
  ProductShippingInfo__Output as _productPackage_ProductShippingInfo__Output,
} from '../productPackage/ProductShippingInfo';
import type {
  Category as _categoryPackage_Category,
  Category__Output as _categoryPackage_Category__Output,
} from '../categoryPackage/Category';
import type {
  Tag as _TagPackage_Tag,
  Tag__Output as _TagPackage_Tag__Output,
} from '../TagPackage/Tag';
import type {
  ProductSeo as _productPackage_ProductSeo,
  ProductSeo__Output as _productPackage_ProductSeo__Output,
} from '../productPackage/ProductSeo';
import type {
  Product as _productPackage_Product,
  Product__Output as _productPackage_Product__Output,
} from '../productPackage/Product';

export interface Product {
  id?: number;
  name?: string;
  sku?: string;
  slug?: string;
  type?: _productPackage_ProductType | null;
  description?: string;
  thumbnail?: _photoPackage_Image[];
  gallery?: _photoPackage_Image[];
  inStock?: boolean;
  salePrice?: number | string;
  comparePrice?: number | string;
  maxPrice?: number | string;
  minPrice?: number | string;
  quantity?: number;
  disableOutOfStock?: boolean;
  variations?: _productPackage_Variation[];
  variationOptions?: _productPackage_VariationOption[];
  productShippingInfo?: _productPackage_ProductShippingInfo | null;
  categories?: _categoryPackage_Category[];
  tags?: _TagPackage_Tag[];
  productSeo?: _productPackage_ProductSeo | null;
  relatedProducts?: _productPackage_Product[];
  upsellProducts?: _productPackage_Product[];
  crossSellProducts?: _productPackage_Product[];
}

export interface Product__Output {
  id: number;
  name: string;
  sku: string;
  slug: string;
  type: _productPackage_ProductType__Output | null;
  description: string;
  thumbnail: _photoPackage_Image__Output[];
  gallery: _photoPackage_Image__Output[];
  inStock: boolean;
  salePrice: number;
  comparePrice: number;
  maxPrice: number;
  minPrice: number;
  quantity: number;
  disableOutOfStock: boolean;
  variations: _productPackage_Variation__Output[];
  variationOptions: _productPackage_VariationOption__Output[];
  productShippingInfo: _productPackage_ProductShippingInfo__Output | null;
  categories: _categoryPackage_Category__Output[];
  tags: _TagPackage_Tag__Output[];
  productSeo: _productPackage_ProductSeo__Output | null;
  relatedProducts: _productPackage_Product__Output[];
  upsellProducts: _productPackage_Product__Output[];
  crossSellProducts: _productPackage_Product__Output[];
}
