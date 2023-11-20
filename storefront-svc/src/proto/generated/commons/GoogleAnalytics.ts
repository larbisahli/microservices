// Original file: src/proto/commons.proto


export interface GoogleAnalytics {
  'trackingId'?: (string);
  'isEnabled'?: (boolean);
  'isTrackOrders'?: (boolean);
  'isTrackCheckout'?: (boolean);
  'isTrackVisitors'?: (boolean);
  'isTrackUserLogin'?: (boolean);
  'isTrackUserRegister'?: (boolean);
  'isTrackCheckoutOptions'?: (boolean);
  'isTrackProductAddToCart'?: (boolean);
  'isTrackProductRemoveToCart'?: (boolean);
}

export interface GoogleAnalytics__Output {
  'trackingId': (string);
  'isEnabled': (boolean);
  'isTrackOrders': (boolean);
  'isTrackCheckout': (boolean);
  'isTrackVisitors': (boolean);
  'isTrackUserLogin': (boolean);
  'isTrackUserRegister': (boolean);
  'isTrackCheckoutOptions': (boolean);
  'isTrackProductAddToCart': (boolean);
  'isTrackProductRemoveToCart': (boolean);
}
