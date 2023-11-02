// Original file: src/proto/product.proto

import type {
  Attribute as _AttributePackage_Attribute,
  Attribute__Output as _AttributePackage_Attribute__Output,
} from '../AttributePackage/Attribute';
import type {
  AttributeValue as _AttributePackage_AttributeValue,
  AttributeValue__Output as _AttributePackage_AttributeValue__Output,
} from '../AttributePackage/AttributeValue';

export interface Variation {
  attribute?: _AttributePackage_Attribute | null;
  values?: _AttributePackage_AttributeValue[];
}

export interface Variation__Output {
  attribute: _AttributePackage_Attribute__Output | null;
  values: _AttributePackage_AttributeValue__Output[];
}
