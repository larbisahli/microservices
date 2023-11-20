// Original file: src/proto/category.proto


export interface CategoryRequest {
  'urlKey'?: (string);
  'alias'?: (string);
  'storeLanguageId'?: (number);
  'storeId'?: (string);
  '_storeId'?: "storeId";
}

export interface CategoryRequest__Output {
  'urlKey': (string);
  'alias': (string);
  'storeLanguageId': (number);
  'storeId'?: (string);
  '_storeId': "storeId";
}
