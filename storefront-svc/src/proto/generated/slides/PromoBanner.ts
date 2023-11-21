// Original file: src/proto/slides.proto

import type {
  Slider as _slides_Slider,
  Slider__Output as _slides_Slider__Output,
} from '../slides/Slider';

export interface PromoBanner {
  animationSpeed?: string;
  backgroundColor?: string;
  direction?: string;
  sliders?: _slides_Slider[];
}

export interface PromoBanner__Output {
  animationSpeed: string;
  backgroundColor: string;
  direction: string;
  sliders: _slides_Slider__Output[];
}
