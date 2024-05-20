// Original file: src/proto/layout.proto

import type {
  LayoutBlock as _layout_LayoutBlock,
  LayoutBlock__Output as _layout_LayoutBlock__Output,
} from '../layout/LayoutBlock';

export interface LayoutBlock {
  componentId?: string;
  moduleName?: string;
  moduleGroup?: string;
  position?: number;
  data?: Buffer | Uint8Array | string;
  children?: _layout_LayoutBlock[];
}

export interface LayoutBlock__Output {
  componentId: string;
  moduleName: string;
  moduleGroup: string;
  position: number;
  data: Buffer;
  children: _layout_LayoutBlock__Output[];
}
