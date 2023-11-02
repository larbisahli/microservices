// Original file: src/proto/slide.proto

import type {
  Slider as _slidePackage_Slider,
  Slider__Output as _slidePackage_Slider__Output,
} from '../slidePackage/Slider';

export interface StorePromoBanner {
  animationSpeed?: string;
  backgroundColor?: string;
  direction?: string;
  sliders?: _slidePackage_Slider[];
}

export interface StorePromoBanner__Output {
  animationSpeed: string;
  backgroundColor: string;
  direction: string;
  sliders: _slidePackage_Slider__Output[];
}
