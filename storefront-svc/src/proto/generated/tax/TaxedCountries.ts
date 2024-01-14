// Original file: src/proto/tax.proto

import type { AppliesTo as _tax_AppliesTo, AppliesTo__Output as _tax_AppliesTo__Output } from '../tax/AppliesTo';

export interface TaxedCountries {
  'iso2'?: (string);
  'rate'?: (number);
  'appliesTo'?: (_tax_AppliesTo | null);
}

export interface TaxedCountries__Output {
  'iso2': (string);
  'rate': (number);
  'appliesTo': (_tax_AppliesTo__Output | null);
}
