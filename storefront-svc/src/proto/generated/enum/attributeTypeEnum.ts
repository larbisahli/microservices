// Original file: src/proto/enum.proto

export const attributeTypeEnum = {
  color: 'color',
  text: 'text',
} as const;

export type attributeTypeEnum = 'color' | 0 | 'text' | 1;

export type attributeTypeEnum__Output =
  typeof attributeTypeEnum[keyof typeof attributeTypeEnum];
