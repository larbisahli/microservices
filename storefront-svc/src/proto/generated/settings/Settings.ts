// Original file: src/proto/settings.proto

import type {
  Image as _media_Image,
  Image__Output as _media_Image__Output,
} from '../media/Image';
import type {
  Currency as _commons_Currency,
  Currency__Output as _commons_Currency__Output,
} from '../commons/Currency';
import type {
  Language as _language_Language,
  Language__Output as _language_Language__Output,
} from '../language/Language';
import type {
  GoogleAnalytics as _commons_GoogleAnalytics,
  GoogleAnalytics__Output as _commons_GoogleAnalytics__Output,
} from '../commons/GoogleAnalytics';
import type {
  Seo as _commons_Seo,
  Seo__Output as _commons_Seo__Output,
} from '../commons/Seo';
import type {
  Tax as _tax_Tax,
  Tax__Output as _tax_Tax__Output,
} from '../tax/Tax';

export interface Settings {
  id?: number;
  logo?: _media_Image[];
  favicon?: _media_Image[];
  storeName?: string;
  storeEmail?: string;
  storeNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  currencies?: _commons_Currency[];
  defaultCurrency?: _commons_Currency | null;
  locales?: _language_Language[];
  google?: _commons_GoogleAnalytics | null;
  maxCheckoutQuantity?: number;
  maxCheckoutAmount?: number;
  seo?: _commons_Seo | null;
  alias?: string;
  storeId?: string;
  templateId?: string;
  tax?: _tax_Tax | null;
}

export interface Settings__Output {
  id: number;
  logo: _media_Image__Output[];
  favicon: _media_Image__Output[];
  storeName: string;
  storeEmail: string;
  storeNumber: string;
  addressLine1: string;
  addressLine2: string;
  currencies: _commons_Currency__Output[];
  defaultCurrency: _commons_Currency__Output | null;
  locales: _language_Language__Output[];
  google: _commons_GoogleAnalytics__Output | null;
  maxCheckoutQuantity: number;
  maxCheckoutAmount: number;
  seo: _commons_Seo__Output | null;
  alias: string;
  storeId: string;
  templateId: string;
  tax: _tax_Tax__Output | null;
}
