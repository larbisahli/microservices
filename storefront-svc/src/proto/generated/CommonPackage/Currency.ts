// Original file: src/proto/common.proto

export interface Currency {
  symbol?: string;
  name?: string;
  symbolNative?: string;
  decimalDigits?: string;
  rounding?: number;
  code?: string;
  namePlural?: string;
}

export interface Currency__Output {
  symbol: string;
  name: string;
  symbolNative: string;
  decimalDigits: string;
  rounding: number;
  code: string;
  namePlural: string;
}
