import type {
  AttributesType,
  CategoryType,
  DeliveryTimeType,
  LanguageProps,
  ManufacturerType,
  OrderStatusType,
  PageType,
  ProductType,
  ShippingZoneType,
  TagType,
  TaxType,
} from './interfaces';

export interface TagGQValuesProps extends TagType, LanguageProps {}
export interface TaxGQValuesProps extends TaxType, LanguageProps {}
export interface CategoryGQValuesProps extends CategoryType, LanguageProps {}
export interface ProductGQValuesProps extends ProductType, LanguageProps {}
export interface ManufacturerGQValuesProps
  extends ManufacturerType,
    LanguageProps {}
export interface AttributeGQValuesProps extends AttributesType, LanguageProps {}
export interface PageGQValuesProps extends PageType, LanguageProps {}
export interface DeliveryTimeGQValuesProps
  extends DeliveryTimeType,
    LanguageProps {}
export interface ShippingZoneGQValuesProps
  extends ShippingZoneType,
    LanguageProps {}
export interface OrderStatusGQValuesProps
  extends OrderStatusType,
    LanguageProps {}
