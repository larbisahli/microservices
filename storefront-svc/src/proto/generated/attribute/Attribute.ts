// Original file: src/proto/attribute.proto

import type { AttributeValue as _attribute_AttributeValue, AttributeValue__Output as _attribute_AttributeValue__Output } from '../attribute/AttributeValue';

export interface Attribute {
  'id'?: (number);
  'name'?: (string);
  'type'?: (string);
  'values'?: (_attribute_AttributeValue)[];
}

export interface Attribute__Output {
  'id': (number);
  'name': (string);
  'type': (string);
  'values': (_attribute_AttributeValue__Output)[];
}
