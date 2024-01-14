// Original file: src/proto/slides.proto

import type { Slider as _slides_Slider, Slider__Output as _slides_Slider__Output } from '../slides/Slider';

export interface PromoBanner {
  'delaySpeed'?: (string);
  'backgroundColor'?: (string);
  'direction'?: (string);
  'sliders'?: (_slides_Slider)[];
}

export interface PromoBanner__Output {
  'delaySpeed': (string);
  'backgroundColor': (string);
  'direction': (string);
  'sliders': (_slides_Slider__Output)[];
}
