// Original file: src/proto/shipping.proto

import type { Unit as _commons_Unit, Unit__Output as _commons_Unit__Output } from '../commons/Unit';

export interface Rate {
  'id'?: (number);
  'shippingZoneId'?: (number);
  'weightUnit'?: (_commons_Unit | null);
  'min'?: (number | string);
  'max'?: (number | string);
  'noMax'?: (boolean);
  'price'?: (number | string);
}

export interface Rate__Output {
  'id': (number);
  'shippingZoneId': (number);
  'weightUnit': (_commons_Unit__Output | null);
  'min': (number);
  'max': (number);
  'noMax': (boolean);
  'price': (number);
}
