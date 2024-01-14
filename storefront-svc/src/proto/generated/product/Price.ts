// Original file: src/proto/product.proto


export interface Price {
  'salePrice'?: (number | string);
  'maxSalePrice'?: (number | string);
  'minSalePrice'?: (number | string);
  'comparePrice'?: (number | string);
  'maxComparePrice'?: (number | string);
  'minComparePrice'?: (number | string);
}

export interface Price__Output {
  'salePrice': (number);
  'maxSalePrice': (number);
  'minSalePrice': (number);
  'comparePrice': (number);
  'maxComparePrice': (number);
  'minComparePrice': (number);
}
