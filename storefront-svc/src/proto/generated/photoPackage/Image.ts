// Original file: src/proto/photo.proto

import type {
  Timestamp as _google_protobuf_Timestamp,
  Timestamp__Output as _google_protobuf_Timestamp__Output,
} from '../google/protobuf/Timestamp';

export interface Image {
  id?: number;
  image?: string;
  placeholder?: string;
  size?: number;
  createdAt?: _google_protobuf_Timestamp | null;
}

export interface Image__Output {
  id: number;
  image: string;
  placeholder: string;
  size: number;
  createdAt: _google_protobuf_Timestamp__Output | null;
}
