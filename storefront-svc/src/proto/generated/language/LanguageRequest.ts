// Original file: src/proto/language.proto


export interface LanguageRequest {
  'id'?: (number);
  'alias'?: (string);
  'storeId'?: (string);
  '_storeId'?: "storeId";
}

export interface LanguageRequest__Output {
  'id': (number);
  'alias': (string);
  'storeId'?: (string);
  '_storeId': "storeId";
}
