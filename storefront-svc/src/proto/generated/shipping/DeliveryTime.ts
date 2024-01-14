// Original file: src/proto/shipping.proto

import type { Unit as _commons_Unit, Unit__Output as _commons_Unit__Output } from '../commons/Unit';

export interface DeliveryTime {
  'unit'?: (_commons_Unit | null);
  'min'?: (number);
  'max'?: (number);
}

export interface DeliveryTime__Output {
  'unit': (_commons_Unit__Output | null);
  'min': (number);
  'max': (number);
}
