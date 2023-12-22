// Original file: src/proto/product.proto

export interface Discount {
  amountOff?: number | string;
  percentOff?: number | string;
}

export interface Discount__Output {
  amountOff: number;
  percentOff: number;
}
