// Original file: src/proto/user.proto

import type {
  Privileges as _userPackage_Privileges,
  Privileges__Output as _userPackage_Privileges__Output,
} from '../userPackage/Privileges';

export interface Role {
  id?: number;
  name?: string;
  privileges?: _userPackage_Privileges | null;
}

export interface Role__Output {
  id: number;
  name: string;
  privileges: _userPackage_Privileges__Output | null;
}
