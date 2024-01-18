// Original file: src/proto/checkout.proto

import type {
  DeliveryTime as _shipping_DeliveryTime,
  DeliveryTime__Output as _shipping_DeliveryTime__Output,
} from '../shipping/DeliveryTime';
import type {
  Image as _media_Image,
  Image__Output as _media_Image__Output,
} from '../media/Image';

export interface Shipment {
  id?: number;
  name?: string;
  deliveryTime?: _shipping_DeliveryTime | null;
  freeShipping?: boolean;
  logo?: _media_Image[];
  rateType?: string;
  price?: number | string;
}

export interface Shipment__Output {
  id: number;
  name: string;
  deliveryTime: _shipping_DeliveryTime__Output | null;
  freeShipping: boolean;
  logo: _media_Image__Output[];
  rateType: string;
  price: number;
}
