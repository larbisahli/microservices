// Original file: src/proto/attribute.proto

import type { attributeTypeEnum as _enum_attributeTypeEnum, attributeTypeEnum__Output as _enum_attributeTypeEnum__Output } from '../enum/attributeTypeEnum';
import type { AttributeValue as _attribute_AttributeValue, AttributeValue__Output as _attribute_AttributeValue__Output } from '../attribute/AttributeValue';

export interface Attribute {
  'id'?: (number);
  'name'?: (string);
  'type'?: (_enum_attributeTypeEnum);
  'values'?: (_attribute_AttributeValue)[];
}

export interface Attribute__Output {
  'id': (number);
  'name': (string);
  'type': (_enum_attributeTypeEnum__Output);
  'values': (_attribute_AttributeValue__Output)[];
}
