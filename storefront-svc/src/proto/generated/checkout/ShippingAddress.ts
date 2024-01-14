// Original file: src/proto/checkout.proto

import type { Country as _commons_Country, Country__Output as _commons_Country__Output } from '../commons/Country';

export interface ShippingAddress {
  'fullName'?: (string);
  'marketingOptIn'?: (boolean);
  'country'?: (_commons_Country | null);
  'address'?: (string);
  'city'?: (string);
  'state'?: (string);
  'zip'?: (string);
  'phone'?: (string);
  'email'?: (string);
}

export interface ShippingAddress__Output {
  'fullName': (string);
  'marketingOptIn': (boolean);
  'country': (_commons_Country__Output | null);
  'address': (string);
  'city': (string);
  'state': (string);
  'zip': (string);
  'phone': (string);
  'email': (string);
}
