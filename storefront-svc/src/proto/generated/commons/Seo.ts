// Original file: src/proto/commons.proto

import type { Image as _media_Image, Image__Output as _media_Image__Output } from '../media/Image';

export interface Seo {
  'metaTitle'?: (string);
  'metaDescription'?: (string);
  'ogTitle'?: (string);
  'ogDescription'?: (string);
  'ogImage'?: (_media_Image)[];
  'twitterHandle'?: (string);
  'twitterCardType'?: (string);
  'metaTags'?: (string);
  'canonicalUrl'?: (string);
}

export interface Seo__Output {
  'metaTitle': (string);
  'metaDescription': (string);
  'ogTitle': (string);
  'ogDescription': (string);
  'ogImage': (_media_Image__Output)[];
  'twitterHandle': (string);
  'twitterCardType': (string);
  'metaTags': (string);
  'canonicalUrl': (string);
}
