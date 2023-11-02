// Original file: src/proto/common.proto

import type {
  Icon as _CommonPackage_Icon,
  Icon__Output as _CommonPackage_Icon__Output,
} from '../CommonPackage/Icon';

export interface Social {
  url?: string;
  icon?: _CommonPackage_Icon | null;
}

export interface Social__Output {
  url: string;
  icon: _CommonPackage_Icon__Output | null;
}
