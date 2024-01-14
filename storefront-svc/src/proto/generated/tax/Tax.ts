// Original file: src/proto/tax.proto

import type { TaxedCountries as _tax_TaxedCountries, TaxedCountries__Output as _tax_TaxedCountries__Output } from '../tax/TaxedCountries';

export interface Tax {
  'name'?: (string);
  'rate'?: (number);
  'countries'?: (_tax_TaxedCountries)[];
}

export interface Tax__Output {
  'name': (string);
  'rate': (number);
  'countries': (_tax_TaxedCountries__Output)[];
}
