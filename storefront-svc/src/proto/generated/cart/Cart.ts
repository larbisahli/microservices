// Original file: src/proto/cart.proto

import type {
  Item as _cart_Item,
  Item__Output as _cart_Item__Output,
} from '../cart/Item';
import type {
  Total as _cart_Total,
  Total__Output as _cart_Total__Output,
} from '../cart/Total';

export interface Cart {
  id?: string;
  items?: _cart_Item[];
  totalQuantity?: number;
  total?: _cart_Total | null;
}

export interface Cart__Output {
  id: string;
  items: _cart_Item__Output[];
  totalQuantity: number;
  total: _cart_Total__Output | null;
}
