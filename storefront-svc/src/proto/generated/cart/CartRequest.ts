// Original file: src/proto/cart.proto


export interface CartRequest {
  'alias'?: (string);
  'storeLanguageId'?: (number);
  'cuid'?: (string);
  'storeId'?: (string);
  '_storeId'?: "storeId";
}

export interface CartRequest__Output {
  'alias': (string);
  'storeLanguageId': (number);
  'cuid': (string);
  'storeId'?: (string);
  '_storeId': "storeId";
}
