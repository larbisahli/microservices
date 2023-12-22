// Original file: src/proto/tax.proto

import type {
  ZipCodeRange as _tax_ZipCodeRange,
  ZipCodeRange__Output as _tax_ZipCodeRange__Output,
} from '../tax/ZipCodeRange';

export interface AppliesTo {
  zipCode?: string;
  zipCodeRange?: _tax_ZipCodeRange | null;
  entireCountry?: boolean;
  state?: string;
}

export interface AppliesTo__Output {
  zipCode: string;
  zipCodeRange: _tax_ZipCodeRange__Output | null;
  entireCountry: boolean;
  state: string;
}
