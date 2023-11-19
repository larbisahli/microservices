// Original file: src/proto/enum.proto

export const productTypeEnum = {
  simple: 'simple',
  variable: 'variable',
} as const;

export type productTypeEnum = 'simple' | 0 | 'variable' | 1;

export type productTypeEnum__Output =
  typeof productTypeEnum[keyof typeof productTypeEnum];
