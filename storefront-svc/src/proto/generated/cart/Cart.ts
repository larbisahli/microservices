// Original file: src/proto/cart.proto

import type { Item as _cart_Item, Item__Output as _cart_Item__Output } from '../cart/Item';

export interface Cart {
  'id'?: (string);
  'items'?: (_cart_Item)[];
  'totalQuantity'?: (number);
}

export interface Cart__Output {
  'id': (string);
  'items': (_cart_Item__Output)[];
  'totalQuantity': (number);
}
