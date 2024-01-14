// Original file: src/proto/product.proto

import type { Attribute as _attribute_Attribute, Attribute__Output as _attribute_Attribute__Output } from '../attribute/Attribute';
import type { AttributeValue as _attribute_AttributeValue, AttributeValue__Output as _attribute_AttributeValue__Output } from '../attribute/AttributeValue';

export interface Variation {
  'attribute'?: (_attribute_Attribute | null);
  'values'?: (_attribute_AttributeValue)[];
}

export interface Variation__Output {
  'attribute': (_attribute_Attribute__Output | null);
  'values': (_attribute_AttributeValue__Output)[];
}
