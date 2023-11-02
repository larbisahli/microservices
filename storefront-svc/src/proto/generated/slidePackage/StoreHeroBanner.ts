// Original file: src/proto/slide.proto

import type {
  Image as _photoPackage_Image,
  Image__Output as _photoPackage_Image__Output,
} from '../photoPackage/Image';
import type {
  HeroBannerStyle as _slidePackage_HeroBannerStyle,
  HeroBannerStyle__Output as _slidePackage_HeroBannerStyle__Output,
} from '../slidePackage/HeroBannerStyle';
import type {
  Timestamp as _google_protobuf_Timestamp,
  Timestamp__Output as _google_protobuf_Timestamp__Output,
} from '../google/protobuf/Timestamp';

export interface StoreHeroBanner {
  id?: number;
  rul?: string;
  title?: string;
  description?: string;
  thumbnail?: _photoPackage_Image[];
  published?: boolean;
  btnLabel?: string;
  styles?: _slidePackage_HeroBannerStyle | null;
  position?: number;
  createdAt?: _google_protobuf_Timestamp | null;
  updatedAt?: _google_protobuf_Timestamp | null;
}

export interface StoreHeroBanner__Output {
  id: number;
  rul: string;
  title: string;
  description: string;
  thumbnail: _photoPackage_Image__Output[];
  published: boolean;
  btnLabel: string;
  styles: _slidePackage_HeroBannerStyle__Output | null;
  position: number;
  createdAt: _google_protobuf_Timestamp__Output | null;
  updatedAt: _google_protobuf_Timestamp__Output | null;
}
