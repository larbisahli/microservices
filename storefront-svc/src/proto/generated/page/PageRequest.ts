// Original file: src/proto/page.proto


export interface PageRequest {
  'alias'?: (string);
  'storeLanguageId'?: (number);
  'storeId'?: (string);
  'slug'?: (string);
  '_storeId'?: "storeId";
}

export interface PageRequest__Output {
  'alias': (string);
  'storeLanguageId': (number);
  'storeId'?: (string);
  'slug': (string);
  '_storeId': "storeId";
}
