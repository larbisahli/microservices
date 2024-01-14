// Original file: src/proto/enum.proto

export const discountTypeEnum = {
  x: 'x',
} as const;

export type discountTypeEnum =
  | 'x'
  | 1

export type discountTypeEnum__Output = typeof discountTypeEnum[keyof typeof discountTypeEnum]
