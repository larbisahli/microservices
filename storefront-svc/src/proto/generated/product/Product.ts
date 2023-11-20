// Original file: src/proto/product.proto

import type { productTypeEnum as _enum_productTypeEnum, productTypeEnum__Output as _enum_productTypeEnum__Output } from '../enum/productTypeEnum';
import type { Image as _media_Image, Image__Output as _media_Image__Output } from '../media/Image';
import type { Variation as _product_Variation, Variation__Output as _product_Variation__Output } from '../product/Variation';
import type { VariationOption as _product_VariationOption, VariationOption__Output as _product_VariationOption__Output } from '../product/VariationOption';
import type { ProductShippingInfo as _product_ProductShippingInfo, ProductShippingInfo__Output as _product_ProductShippingInfo__Output } from '../product/ProductShippingInfo';
import type { Category as _category_Category, Category__Output as _category_Category__Output } from '../category/Category';
import type { Tag as _tag_Tag, Tag__Output as _tag_Tag__Output } from '../tag/Tag';
import type { ProductSeo as _product_ProductSeo, ProductSeo__Output as _product_ProductSeo__Output } from '../product/ProductSeo';
import type { Product as _product_Product, Product__Output as _product_Product__Output } from '../product/Product';

export interface Product {
  'id'?: (number);
  'name'?: (string);
  'sku'?: (string);
  'slug'?: (string);
  'type'?: (_enum_productTypeEnum);
  'description'?: (string);
  'thumbnail'?: (_media_Image)[];
  'gallery'?: (_media_Image)[];
  'inStock'?: (boolean);
  'salePrice'?: (number | string);
  'comparePrice'?: (number | string);
  'maxPrice'?: (number | string);
  'minPrice'?: (number | string);
  'quantity'?: (number);
  'disableOutOfStock'?: (boolean);
  'variations'?: (_product_Variation)[];
  'variationOptions'?: (_product_VariationOption)[];
  'productShippingInfo'?: (_product_ProductShippingInfo | null);
  'categories'?: (_category_Category)[];
  'tags'?: (_tag_Tag)[];
  'productSeo'?: (_product_ProductSeo | null);
  'relatedProducts'?: (_product_Product)[];
  'upsellProducts'?: (_product_Product)[];
  'crossSellProducts'?: (_product_Product)[];
}

export interface Product__Output {
  'id': (number);
  'name': (string);
  'sku': (string);
  'slug': (string);
  'type': (_enum_productTypeEnum__Output);
  'description': (string);
  'thumbnail': (_media_Image__Output)[];
  'gallery': (_media_Image__Output)[];
  'inStock': (boolean);
  'salePrice': (number);
  'comparePrice': (number);
  'maxPrice': (number);
  'minPrice': (number);
  'quantity': (number);
  'disableOutOfStock': (boolean);
  'variations': (_product_Variation__Output)[];
  'variationOptions': (_product_VariationOption__Output)[];
  'productShippingInfo': (_product_ProductShippingInfo__Output | null);
  'categories': (_category_Category__Output)[];
  'tags': (_tag_Tag__Output)[];
  'productSeo': (_product_ProductSeo__Output | null);
  'relatedProducts': (_product_Product__Output)[];
  'upsellProducts': (_product_Product__Output)[];
  'crossSellProducts': (_product_Product__Output)[];
}
