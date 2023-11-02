// Original file: src/proto/settings.proto

import type {
  Image as _photoPackage_Image,
  Image__Output as _photoPackage_Image__Output,
} from '../photoPackage/Image';
import type {
  Currency as _CommonPackage_Currency,
  Currency__Output as _CommonPackage_Currency__Output,
} from '../CommonPackage/Currency';
import type {
  Social as _CommonPackage_Social,
  Social__Output as _CommonPackage_Social__Output,
} from '../CommonPackage/Social';
import type {
  Seo as _CommonPackage_Seo,
  Seo__Output as _CommonPackage_Seo__Output,
} from '../CommonPackage/Seo';

export interface Settings {
  id?: number;
  logo?: _photoPackage_Image[];
  favicon?: _photoPackage_Image[];
  storeName?: string;
  storeEmail?: string;
  storeNumber?: string;
  currency?: _CommonPackage_Currency | null;
  socials?: _CommonPackage_Social[];
  maxCheckoutQuantity?: number;
  seo?: _CommonPackage_Seo | null;
}

export interface Settings__Output {
  id: number;
  logo: _photoPackage_Image__Output[];
  favicon: _photoPackage_Image__Output[];
  storeName: string;
  storeEmail: string;
  storeNumber: string;
  currency: _CommonPackage_Currency__Output | null;
  socials: _CommonPackage_Social__Output[];
  maxCheckoutQuantity: number;
  seo: _CommonPackage_Seo__Output | null;
}
