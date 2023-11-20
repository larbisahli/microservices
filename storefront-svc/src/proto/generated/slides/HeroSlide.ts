// Original file: src/proto/slides.proto

import type { Image as _media_Image, Image__Output as _media_Image__Output } from '../media/Image';
import type { HeroSlideStyle as _slides_HeroSlideStyle, HeroSlideStyle__Output as _slides_HeroSlideStyle__Output } from '../slides/HeroSlideStyle';

export interface HeroSlide {
  'id'?: (number);
  'destinationUrl'?: (string);
  'title'?: (string);
  'description'?: (string);
  'thumbnail'?: (_media_Image)[];
  'published'?: (boolean);
  'btnLabel'?: (string);
  'styles'?: (_slides_HeroSlideStyle | null);
  'position'?: (number);
}

export interface HeroSlide__Output {
  'id': (number);
  'destinationUrl': (string);
  'title': (string);
  'description': (string);
  'thumbnail': (_media_Image__Output)[];
  'published': (boolean);
  'btnLabel': (string);
  'styles': (_slides_HeroSlideStyle__Output | null);
  'position': (number);
}
