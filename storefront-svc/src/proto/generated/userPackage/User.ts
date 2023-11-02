// Original file: src/proto/user.proto

import type {
  Image as _photoPackage_Image,
  Image__Output as _photoPackage_Image__Output,
} from '../photoPackage/Image';
import type {
  Role as _userPackage_Role,
  Role__Output as _userPackage_Role__Output,
} from '../userPackage/Role';
import type {
  Store as _userPackage_Store,
  Store__Output as _userPackage_Store__Output,
} from '../userPackage/Store';

export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isAdmin?: boolean;
  profile?: _photoPackage_Image[];
  role?: _userPackage_Role | null;
  active?: boolean;
  store?: _userPackage_Store | null;
}

export interface User__Output {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
  profile: _photoPackage_Image__Output[];
  role: _userPackage_Role__Output | null;
  active: boolean;
  store: _userPackage_Store__Output | null;
}
