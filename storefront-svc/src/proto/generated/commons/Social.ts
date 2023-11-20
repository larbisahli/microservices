// Original file: src/proto/commons.proto

import type { Icon as _commons_Icon, Icon__Output as _commons_Icon__Output } from '../commons/Icon';

export interface Social {
  'url'?: (string);
  'icon'?: (_commons_Icon | null);
}

export interface Social__Output {
  'url': (string);
  'icon': (_commons_Icon__Output | null);
}
