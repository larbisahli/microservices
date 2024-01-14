// Original file: src/proto/shipping.proto

import type { DeliveryTime as _shipping_DeliveryTime, DeliveryTime__Output as _shipping_DeliveryTime__Output } from '../shipping/DeliveryTime';
import type { Image as _media_Image, Image__Output as _media_Image__Output } from '../media/Image';
import type { Rate as _shipping_Rate, Rate__Output as _shipping_Rate__Output } from '../shipping/Rate';
import type { Country as _commons_Country, Country__Output as _commons_Country__Output } from '../commons/Country';

export interface Shipping {
  'id'?: (number);
  'deliveryTime'?: (_shipping_DeliveryTime | null);
  'freeShipping'?: (boolean);
  'name'?: (string);
  'logo'?: (_media_Image)[];
  'rateType'?: (string);
  'rates'?: (_shipping_Rate)[];
  'zones'?: (_commons_Country)[];
}

export interface Shipping__Output {
  'id': (number);
  'deliveryTime': (_shipping_DeliveryTime__Output | null);
  'freeShipping': (boolean);
  'name': (string);
  'logo': (_media_Image__Output)[];
  'rateType': (string);
  'rates': (_shipping_Rate__Output)[];
  'zones': (_commons_Country__Output)[];
}
