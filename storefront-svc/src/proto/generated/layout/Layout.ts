// Original file: src/proto/layout.proto

import type {
  LayoutBlock as _layout_LayoutBlock,
  LayoutBlock__Output as _layout_LayoutBlock__Output,
} from '../layout/LayoutBlock';

export interface Layout {
  templateId?: string;
  settings?: Buffer | Uint8Array | string;
  layoutId?: string;
  layoutName?: string;
  title?: string;
  jssHeader?: _layout_LayoutBlock | null;
  jssMain?: _layout_LayoutBlock[];
  jssFooter?: _layout_LayoutBlock | null;
}

export interface Layout__Output {
  templateId: string;
  settings: Buffer;
  layoutId: string;
  layoutName: string;
  title: string;
  jssHeader: _layout_LayoutBlock__Output | null;
  jssMain: _layout_LayoutBlock__Output[];
  jssFooter: _layout_LayoutBlock__Output | null;
}
