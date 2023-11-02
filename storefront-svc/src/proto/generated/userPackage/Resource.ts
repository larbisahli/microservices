// Original file: src/proto/user.proto

import type {
  Permissions as _userPackage_Permissions,
  Permissions__Output as _userPackage_Permissions__Output,
} from '../userPackage/Permissions';

export interface Resource {
  permissions?: _userPackage_Permissions | null;
}

export interface Resource__Output {
  permissions: _userPackage_Permissions__Output | null;
}
