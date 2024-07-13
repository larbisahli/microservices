import { AttributeTypes } from './enums';
import { PrivilegesType } from './index';

// ******** <QUERIES> ********

export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC',
}

export enum OrderBy {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export enum CouponDiscountsType {
  Fixed = 'fixed',
  Percentage = 'percentage',
  FreeShipping = 'free_shipping',
}

// Nullable can be assigned to a value or can be assigned to null.
export declare type Nullable<T> = T | null;

/** Built-in and custom scalars are mapped to their actual values */
export declare type Scalars = {
  ID: string | number;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: { [key: string]: string | number | boolean };
  SortOrder: SortOrder.Asc | SortOrder.Desc;
  /** A datetime string with format `Y-m-d H:i:s`, e.g. `2018-05-23 13:43:32`. */
  DateTime: string | number | Date;
  Mixed: string | number | Date;
  Upload: string | number | Date;
  /** A date string with format `Y-m-d`, e.g. `2011-05-23`. */
  Date: string | number | Date;
  /** A datetime and timezone string in ISO 8601 format `Y-m-dTH:i:sO`, e.g. `2020-04-20T13:53:12+02:00`. */
  DateTimeTz: string | number | Date;
};

interface SharedValues {
  createdAt?: Nullable<Scalars['DateTimeTz']>;
  updatedAt?: Nullable<Scalars['DateTimeTz']>;
  createdBy?: Nullable<{
    id: Scalars['ID'];
    firstName?: Scalars['String'];
    lastName?: Scalars['String'];
    profile?: ImageType;
  }>;
  updatedBy?: Nullable<{
    id: Scalars['ID'];
    firstName?: Scalars['String'];
    lastName?: Scalars['String'];
    profile?: ImageType;
  }>;
  // extra
  page?: Scalars['Int'];
  limit?: Scalars['Int'];
  orderBy?: OrderBy;
  sortedBy?: SortOrder;
  count?: number;
}

export interface LanguageProps {
  language: LanguageType;
  defaultLanguage: LanguageType;
}

export interface AliasType {
  name?: string;
  domain?: string;
}

export type CurrencyType = {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
};
export interface StoreType extends SharedValues {
  id: Scalars['String'];
  tenant_id?: Scalars['ID'];
  email?: string;
  phoneNumber?: string;
  storeName?: string;
  alias: string;
  published?: boolean;
  country?: CountryType;
  time_zone?: Scalars['Date'];
  tax?: number;
  tier?: 'gold' | 'silver' | 'bronze' | 'free-14-days';
  contact?: unknown;
  store_seo?: unknown;
  locale?: LanguageType;
  // For store creation
  firstName?: string;
  lastName?: string;
  currency?: CurrencyType;
  acceptCondition?: Scalars['Boolean'];
  token?: string;
  password?: string;
  defaultLanguage: LanguageType;
}

export interface CategoryType extends SharedValues {
  id: Scalars['Int'];
  parentId?: Nullable<Scalars['Int']>;
  name: Scalars['String'];
  description: Nullable<Scalars['String']>;
  active: Scalars['Boolean'];
  level: Scalars['Int'];
  position: Scalars['Int'];
  thumbnail: ImageType[];
  hasChildren?: Scalars['Boolean'];
  categoryId: number;
  metaTitle: Scalars['String'];
  urlKey: Scalars['String'];
  metaKeywords: Scalars['String'];
  metaDescription: Scalars['String'];
  metaRobots?: { value: Scalars['String'] } | string | undefined;
  breadcrumbsPriority: number;
  metaImage: ImageType[];
}

export interface AttributesType extends SharedValues {
  id: Scalars['Int'];
  name: Scalars['String'];
  type: AttributeTypes;
  values: AttributeValuesType[];
  translated: { name: string };
}

export interface AttributeValuesType {
  id: Scalars['Int'];
  attributeId?: Scalars['String'];
  value?: Scalars['String'];
  name?: Scalars['String'];
  translated: {
    value: string;
    name: string;
  };
}

export interface TagType extends SharedValues {
  id: Scalars['Int'];
  name: Scalars['String'];
}

export interface LanguageType extends SharedValues {
  id: Scalars['Int'];
  remoteFilePath: Scalars['String'];
  name: Scalars['String'];
  localeId: Scalars['String'];
  direction: Scalars['String'];
  active: Scalars['Boolean'];
  iso2: Scalars['String'];
  isDefault: Scalars['Boolean'];
  translation: Scalars['JSON'];
}

export interface StoreViewType extends SharedValues {
  id: Scalars['Int'];
  name: Scalars['String'];
  code: Scalars['String'];
  isDefault: Scalars['Boolean'];
  active: Scalars['Boolean'];
  language: LanguageType;
}

export interface DeliveryTimeType extends SharedValues {
  id: Scalars['Int'];
  name: Scalars['String'];
  unit: { unit: Scalars['String'] };
  min: Scalars['Int'];
  max: Scalars['Int'];
}

export interface ThemeType {
  id: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  themePath: Scalars['String'];
  previewImage: Scalars['String'];
  reviewsCount: Scalars['Int'];
  ratingStarCount: Scalars['Int'];
  price: Scalars['Int'];
  isFree: Scalars['Boolean'];
  version: Scalars['String'];
  updatedAt: Scalars['Date'];
}

export interface OrderStatusType extends SharedValues {
  id: Scalars['Int'];
  name?: Scalars['String'];
  color?: Scalars['String'];
  privacy?: Scalars['String'];
}

export interface CouponType extends SharedValues {
  id: Scalars['Int'];
  code: Scalars['String'];
  discountValue: Scalars['Int'];
  orderAmountLimit: Scalars['Int'];
  discountType: CouponDiscountsType;
  imagePath?: Nullable<Scalars['String']>;
  timesUsed?: Nullable<Scalars['Int']>;
  maxUsage?: Nullable<Scalars['Int']>;
  couponStartDate?: Nullable<Scalars['Date']>;
  couponEndDate?: Nullable<Scalars['Date']>;
}

export interface ProductType extends SharedValues {
  id: Scalars['Int'];
  name?: Scalars['String'];
  sku?: Nullable<Scalars['String']>;
  slug?: Nullable<Scalars['String']>;
  metaImage?: ImageType[];
  salePrice?: Scalars['Float'];
  comparePrice?: Scalars['Float'];
  buyingPrice?: Scalars['Float'];
  maxPrice?: Scalars['Float'];
  minPrice?: Scalars['Float'];
  quantity?: Scalars['Int'];
  case?: Scalars['Int']; //SUM()
  description?: Scalars['String'];
  type?: 'simple' | 'variable';
  published?: Scalars['Boolean'];
  status?: 'draft' | 'publish';
  disableOutOfStock?: Scalars['Boolean'];
  freeShipping?: Scalars['Boolean'];
  displayProductMeasurements?: Scalars['Boolean'];
  note?: Nullable<Scalars['String']>;
  thumbnail?: ImageType[];
  gallery?: ImageType[];
  manufacturers?: ManufacturerType[];
  categories?: Array<CategoryType>;
  suppliers?: Array<SuppliersType>;
  tags?: Array<TagType>;
  attributes?: AttributeVariationType[];
  productShippingInfo?: ProductShippingInfo;
  variationOptions?: ProductVariationOptions[];
  variations?: VariationType[];
  productSeo?: ProductTranslationType;
  relatedProducts?: Array<Nullable<ProductRef>>;
  upsellProducts?: Array<Nullable<ProductRef>>;
  crossSellProducts?: Array<Nullable<ProductRef>>;
  // [key: string]: any;
}

export interface AttributeVariationType {
  id?: Scalars['ID'];
  attribute: AttributesType;
  value: AttributeValuesType;
}

interface ProductRef {
  id?: Scalars['Int'];
  name?: Scalars['String'];
  sku?: Nullable<Scalars['String']>;
  salePrice?: Scalars['Float'];
  comparePrice?: Scalars['Float'];
  buyingPrice?: Scalars['Float'];
  maxPrice?: Scalars['Float'];
  minPrice?: Scalars['Float'];
  quantity?: Scalars['Int'];
}

export interface ProductTranslationType {
  slug?: Scalars['String'];
  name?: Scalars['String'];
  description?: Scalars['String'];
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  metaImage?: ImageType[];
}

export interface VariationType {
  attribute: AttributesType;
  selectedValues: Array<AttributeValuesType>;
}

export interface UpdateProductType extends SharedValues, LanguageProps {
  id: Scalars['Int'];
  additions: UpdateProductValues;
  deletions: UpdateProductValues;
  // [key: string]: any;
}

interface UpdateProductValues {
  productMain?: {
    id?: Scalars['Int'];
    slug?: Scalars['String'];
    name?: Scalars['String'];
    sku?: Nullable<Scalars['String']>;
    salePrice?: Scalars['Float'];
    comparePrice?: Scalars['Float'];
    buyingPrice?: Scalars['Float'];
    maxPrice?: Scalars['Float'];
    minPrice?: Scalars['Float'];
    quantity?: Scalars['Int'];
    shortDescription?: Nullable<Scalars['String']>;
    description?: Scalars['String'];
    type?: { id: Scalars['String'] };
    published?: Scalars['Boolean'];
    status?: 'draft' | 'publish';
    disableOutOfStock?: Scalars['Boolean'];
    note?: Nullable<Scalars['String']>;
  };
  thumbnail?: ImageType[];
  gallery?: ImageType[];
  categories?: Array<CategoryType>;
  suppliers?: Nullable<Array<SuppliersType>>;
  tags?: Nullable<Array<TagType>>;
  manufacturers?: Nullable<Array<ManufacturerType>>;
  productShippingInfo?: ProductShippingInfo;
  attributes?: AttributeVariationType[];
  variationOptions?: ProductVariationOptions[];
  variations?: VariationType[];
  relatedProducts?: Nullable<Array<Nullable<ProductRef>>>;
  upsellProducts?: Nullable<Array<Nullable<ProductRef>>>;
  crossSellProducts?: Nullable<Array<Nullable<ProductRef>>>;
}

export interface ProductVariationOptions {
  id: Scalars['Int'];
  productId: Scalars['Int'];
  title: Scalars['String'];
  isDisable: Scalars['Boolean'];
  active: boolean;
  thumbnail: ImageType[];
  options: number[];
  salePrice: Scalars['Float'];
  comparePrice: Scalars['Float'];
  buyingPrice: Scalars['Float'];
  quantity: Scalars['Int'];
  sku: Scalars['String'];
  weight?: Scalars['Int'];
  weightUnit?: { unit: Scalars['String'] };
  dimensionWidth?: Scalars['Int'];
  dimensionHeight?: Scalars['Int'];
  dimensionLength?: Scalars['Int'];
  dimensionUnit?: { unit: Scalars['String'] };
}

export interface ImageType extends SharedValues {
  id?: Scalars['Int'];
  image?: Scalars['String'];
  placeholder?: Scalars['String'];
  size?: number;
  isThumbnail?: boolean;
  mediaId?: string;
  originalname?: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface MediaType extends SharedValues {
  id?: Scalars['String'];
  parent?: MediaType;
  parentId?: Scalars['String'];
  children?: MediaType[];
  name?: Scalars['String'];
  image?: ImageType[];
  itemsCount?: number;
}

export interface TaxType extends SharedValues {
  id: Scalars['Int'];
  name?: Scalars['String'];
  rate?: Scalars['Int'];
  isDefault?: Scalars['Boolean'];
  countries?: {
    id?: Scalars['Int'];
    name?: Scalars['String'];
    iso2?: Scalars['String'];
    rate?: Scalars['Int'];
  }[];
}

export interface ProductShippingInfo {
  id: Scalars['Int'];
  productId?: Scalars['ID'];
  weight?: Scalars['Int'];
  weightUnit?: { unit: Scalars['String'] };
  dimensionWidth?: Scalars['Int'];
  dimensionHeight?: Scalars['Int'];
  dimensionLength?: Scalars['Int'];
  dimensionUnit?: { unit: Scalars['String'] };
}

export interface UserType extends SharedValues {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  email?: string;
  password?: string;
  active?: boolean;
  profile?: ImageType[];
  role?: RoleInterfaceType;
  roleId?: number;
  storeId?: string;
  alias?: string;
  // -----
  token?: string;
  reCaptchaToken?: string;
  storeName?: string;
  ali?: string;
  notify?: boolean;
  store?: StoreType;
  rp_token?: string;
  rp_token_created_at?: Scalars['Date'];
}

export interface RoleInterfaceType {
  id: number;
  roleName: string;
  privileges: PrivilegesType;
}

export interface SuppliersType extends SharedValues {
  id: Scalars['Int'];
  name?: Scalars['String'];
  company?: Nullable<Scalars['String']>;
  phoneNumber?: Nullable<Scalars['String']>;
  dialCode?: Nullable<Scalars['String']>;
  addressLine1?: Scalars['String'];
  addressLine2?: Nullable<Scalars['String']>;
  country?: Nullable<CountryType>;
  city?: Nullable<Scalars['String']>;
  note?: Nullable<Scalars['String']>;
}

export interface ManufacturerType extends SharedValues {
  id: Scalars['Int'];
  name?: Scalars['String'];
  link?: Nullable<Scalars['String']>;
  logo?: ImageType[];
  description?: Nullable<CountryType>;
}

export interface PaymentOrderType {
  items: {
    id: string;
    orderQuantity: number;
    orderVariationOption: { id: string };
  }[];
  paymentIntent: string;
  clientSecret: string;
}

export interface ShippingRateType {
  id: Scalars['Int'];
  shippingZoneId?: Scalars['ID'];
  weightUnit?: { unit: Scalars['String'] };
  min?: Scalars['Int'];
  max?: Nullable<Scalars['Int']>;
  noMax?: Scalars['Boolean'];
  price?: Scalars['Int'];
  index?: Scalars['Int'];
}

export interface CountryType {
  id?: Scalars['Int'];
  zoneId?: Scalars['Int'];
  currency?: Scalars['String'];
  name?: Scalars['String'];
  phone_code?: Scalars['String'];
  iso2?: Scalars['String'];
  region?: Scalars['String'];
  subregion?: Scalars['String'];
}

export interface ShippingZoneType extends SharedValues {
  id: Scalars['Int'];
  name?: Scalars['String'];
  displayName?: Scalars['String'];
  active?: Scalars['Boolean'];
  freeShipping?: Scalars['Boolean'];
  rateType?: 'price' | 'weight' | { id: string; type: string };
  zones?: CountryType[];
  shippingRates?: ShippingRateType[];
  logo?: ImageType[];
  deliveryTime?: DeliveryTimeType;
}

export interface UpdateShippingZoneType extends SharedValues {
  id: Scalars['Int'];
  shippingZone?: {
    id: Scalars['ID'];
    name: Scalars['String'];
    displayName: Scalars['String'];
    active: Scalars['Boolean'];
    freeShipping: Scalars['Boolean'];
    rateType: 'price' | 'weight' | { id?: string; type?: string };
    logo?: ImageType[];
    deliveryTime?: DeliveryTimeType;
  };
  additions: UpdateShippingZoneValues;
  deletions: UpdateShippingZoneValues;
  // [key: string]: any;
}

export interface UpdateShippingZoneValues {
  zones: CountryType[];
  shippingRates: ShippingRateType[];
}

export interface SettingsType {
  logo?: ImageType[];
  favicon?: ImageType[];
  storeName?: string;
  storeEmail?: string;
  storeNumber?: string;
  templateId?: string;
  addressLine1?: string;
  addressLine2?: string;
  currencies?: {
    symbol: string;
    name: string;
    symbol_native: string;
    decimal_digits: number;
    rounding: number;
    code: string;
    name_plural: string;
  }[];
  systemCurrency?: {
    symbol: string;
    name: string;
    symbol_native: string;
    decimal_digits: number;
    rounding: number;
    code: string;
    name_plural: string;
  };
  maxCheckoutQuantity?: number;
  maxCheckoutAmount?: number;
  webmanifest?: WebmanifestType;
  maintenanceMode: boolean;
  maintenancePassword: number;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: ImageType[];
    twitterHandle: string;
    twitterCardType: string;
    metaTags: string;
    canonicalUrl: string;
  };
  google?: {
    isEnabled: boolean;
    trackingId: string;
    isTrackVisitors: boolean;
    isTrackOrders: boolean;
    isTrackUserRegister: boolean;
    isTrackUserLogin: boolean;
    isTrackCheckoutOptions: boolean;
    isTrackProductAddToCart: boolean;
    isTrackProductRemoveToCart: boolean;
    isTrackCheckout: boolean;
  };
  facebook?: {
    isEnable: boolean;
    appId: string;
    pageId: string;
  };
}

export interface WebmanifestType {
  name?: string;
  short_name?: string;
  description?: string;
  language?: string;
  theme_color?: string;
  background_color?: string;
  start_url?: string;
  orientation?: string;
  display?: string;
  iarc_rating_id?: string;
  scope?: string;
}

export interface PageType {
  id: string;
  slug: string;
  name: string;
  languageId: number;
  ogImageId: ImageType[];
  content: string;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  ogMedia: ImageType[];
}

export interface LayoutModuleType {
  name: Scalars['String'];
  group: Scalars['String'];
  pathname: Scalars['String'];
  isDefault: Scalars['Boolean'];
  thumbnail: ImageType;
}

export interface StoreTemplateType {
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  publish: Scalars['Boolean'];
}

export interface StoreTemplateType {
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  publish: Scalars['Boolean'];
  thumbnail: ImageType[];
  gallery: {
    image: ImageType[];
    position: Scalars['Int'];
  }[];
}

export interface StoreLayoutType {
  id: Scalars['String'];
  name: Scalars['String'];
  title: Scalars['String'];
}

export interface StoreLayoutComponentType {
  parentId: Scalars['String'];
  componentId: Scalars['ID'];
  moduleName: string;
  moduleGroup?: string;
  position: Scalars['Int'];
  data?: Buffer | Uint8Array | string;
  styles?: Buffer | Uint8Array | string;
  children?: StoreLayoutComponentType[] | [];
}

export interface StoreLayoutComponentContentType {
  id?: Scalars['ID'];
  contentId: Scalars['ID'];
  [key: string]: string | number | boolean | any;
}
