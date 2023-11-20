// Original file: src/proto/product.proto


export interface ProductRequest {
  'alias'?: (string);
  'storeLanguageId'?: (number);
  'storeId'?: (string);
  'slug'?: (string);
  '_storeId'?: "storeId";
}

export interface ProductRequest__Output {
  'alias': (string);
  'storeLanguageId': (number);
  'storeId'?: (string);
  'slug': (string);
  '_storeId': "storeId";
}
