import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  CategoryServiceRoutesClient as _ServiceRoutes_CategoryServiceRoutesClient,
  CategoryServiceRoutesDefinition as _ServiceRoutes_CategoryServiceRoutesDefinition,
} from './ServiceRoutes/CategoryServiceRoutes';
import type {
  CheckoutServiceRoutesClient as _ServiceRoutes_CheckoutServiceRoutesClient,
  CheckoutServiceRoutesDefinition as _ServiceRoutes_CheckoutServiceRoutesDefinition,
} from './ServiceRoutes/CheckoutServiceRoutes';
import type {
  ConfigServiceRoutesClient as _ServiceRoutes_ConfigServiceRoutesClient,
  ConfigServiceRoutesDefinition as _ServiceRoutes_ConfigServiceRoutesDefinition,
} from './ServiceRoutes/ConfigServiceRoutes';
import type {
  LanguageServiceRoutesClient as _ServiceRoutes_LanguageServiceRoutesClient,
  LanguageServiceRoutesDefinition as _ServiceRoutes_LanguageServiceRoutesDefinition,
} from './ServiceRoutes/LanguageServiceRoutes';
import type {
  PageServiceRoutesClient as _ServiceRoutes_PageServiceRoutesClient,
  PageServiceRoutesDefinition as _ServiceRoutes_PageServiceRoutesDefinition,
} from './ServiceRoutes/PageServiceRoutes';
import type {
  PaymentServiceRoutesClient as _ServiceRoutes_PaymentServiceRoutesClient,
  PaymentServiceRoutesDefinition as _ServiceRoutes_PaymentServiceRoutesDefinition,
} from './ServiceRoutes/PaymentServiceRoutes';
import type {
  ProductServiceRoutesClient as _ServiceRoutes_ProductServiceRoutesClient,
  ProductServiceRoutesDefinition as _ServiceRoutes_ProductServiceRoutesDefinition,
} from './ServiceRoutes/ProductServiceRoutes';
import type {
  ShippingServiceRoutesClient as _ServiceRoutes_ShippingServiceRoutesClient,
  ShippingServiceRoutesDefinition as _ServiceRoutes_ShippingServiceRoutesDefinition,
} from './ServiceRoutes/ShippingServiceRoutes';
import type {
  SliderServiceRoutesClient as _ServiceRoutes_SliderServiceRoutesClient,
  SliderServiceRoutesDefinition as _ServiceRoutes_SliderServiceRoutesDefinition,
} from './ServiceRoutes/SliderServiceRoutes';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  ServiceRoutes: {
    CategoryServiceRoutes: SubtypeConstructor<
      typeof grpc.Client,
      _ServiceRoutes_CategoryServiceRoutesClient
    > & { service: _ServiceRoutes_CategoryServiceRoutesDefinition };
    CheckoutServiceRoutes: SubtypeConstructor<
      typeof grpc.Client,
      _ServiceRoutes_CheckoutServiceRoutesClient
    > & { service: _ServiceRoutes_CheckoutServiceRoutesDefinition };
    ConfigServiceRoutes: SubtypeConstructor<
      typeof grpc.Client,
      _ServiceRoutes_ConfigServiceRoutesClient
    > & { service: _ServiceRoutes_ConfigServiceRoutesDefinition };
    LanguageServiceRoutes: SubtypeConstructor<
      typeof grpc.Client,
      _ServiceRoutes_LanguageServiceRoutesClient
    > & { service: _ServiceRoutes_LanguageServiceRoutesDefinition };
    PageServiceRoutes: SubtypeConstructor<
      typeof grpc.Client,
      _ServiceRoutes_PageServiceRoutesClient
    > & { service: _ServiceRoutes_PageServiceRoutesDefinition };
    PaymentServiceRoutes: SubtypeConstructor<
      typeof grpc.Client,
      _ServiceRoutes_PaymentServiceRoutesClient
    > & { service: _ServiceRoutes_PaymentServiceRoutesDefinition };
    ProductServiceRoutes: SubtypeConstructor<
      typeof grpc.Client,
      _ServiceRoutes_ProductServiceRoutesClient
    > & { service: _ServiceRoutes_ProductServiceRoutesDefinition };
    ShippingServiceRoutes: SubtypeConstructor<
      typeof grpc.Client,
      _ServiceRoutes_ShippingServiceRoutesClient
    > & { service: _ServiceRoutes_ShippingServiceRoutesDefinition };
    SliderServiceRoutes: SubtypeConstructor<
      typeof grpc.Client,
      _ServiceRoutes_SliderServiceRoutesClient
    > & { service: _ServiceRoutes_SliderServiceRoutesDefinition };
  };
  attribute: {
    Attribute: MessageTypeDefinition;
    AttributeValue: MessageTypeDefinition;
  };
  cart: {
    Cart: MessageTypeDefinition;
    CartRequest: MessageTypeDefinition;
    CartResponse: MessageTypeDefinition;
    Item: MessageTypeDefinition;
  };
  category: {
    Breadcrumbs: MessageTypeDefinition;
    Category: MessageTypeDefinition;
    CategoryRequest: MessageTypeDefinition;
    CategoryResponse: MessageTypeDefinition;
    HomePageCategoryRequest: MessageTypeDefinition;
    HomePageCategoryResponse: MessageTypeDefinition;
    Menu: MessageTypeDefinition;
    MenuRequest: MessageTypeDefinition;
    MenuResponse: MessageTypeDefinition;
  };
  checkout: {
    AppliedCoupon: MessageTypeDefinition;
    Checkout: MessageTypeDefinition;
    CheckoutRequest: MessageTypeDefinition;
    CheckoutResponse: MessageTypeDefinition;
    Geo: MessageTypeDefinition;
    Metadata: MessageTypeDefinition;
    PaymentConfiguration: MessageTypeDefinition;
    Shipment: MessageTypeDefinition;
    ShippingAddress: MessageTypeDefinition;
    StepsConfig: MessageTypeDefinition;
  };
  commons: {
    Country: MessageTypeDefinition;
    Currency: MessageTypeDefinition;
    GoogleAnalytics: MessageTypeDefinition;
    Icon: MessageTypeDefinition;
    Seo: MessageTypeDefinition;
    Social: MessageTypeDefinition;
    Unit: MessageTypeDefinition;
  };
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition;
    };
  };
  language: {
    Language: MessageTypeDefinition;
    LanguageRequest: MessageTypeDefinition;
    LanguageResponse: MessageTypeDefinition;
    Translation: MessageTypeDefinition;
  };
  media: {
    Image: MessageTypeDefinition;
  };
  page: {
    Page: MessageTypeDefinition;
    PageRequest: MessageTypeDefinition;
    PageResponse: MessageTypeDefinition;
  };
  payment: {
    StipePaymentRequest: MessageTypeDefinition;
    StipePaymentResponse: MessageTypeDefinition;
    Stripe: MessageTypeDefinition;
  };
  product: {
    CategoryProductsRequest: MessageTypeDefinition;
    PopularProductsRequest: MessageTypeDefinition;
    Price: MessageTypeDefinition;
    Product: MessageTypeDefinition;
    ProductRequest: MessageTypeDefinition;
    ProductResponse: MessageTypeDefinition;
    ProductSeo: MessageTypeDefinition;
    ProductShippingInfo: MessageTypeDefinition;
    ProductsResponse: MessageTypeDefinition;
    Unit: MessageTypeDefinition;
    Variation: MessageTypeDefinition;
    VariationOption: MessageTypeDefinition;
  };
  settings: {
    ConfigRequest: MessageTypeDefinition;
    ConfigResponse: MessageTypeDefinition;
    Settings: MessageTypeDefinition;
  };
  shipping: {
    DeliveryTime: MessageTypeDefinition;
    Shipping: MessageTypeDefinition;
    ShippingRequest: MessageTypeDefinition;
    ShippingResponse: MessageTypeDefinition;
  };
  slides: {
    HeroSlide: MessageTypeDefinition;
    HeroSlideStyle: MessageTypeDefinition;
    HeroSlidesRequest: MessageTypeDefinition;
    HeroSlidesResponse: MessageTypeDefinition;
    PromoBanner: MessageTypeDefinition;
    PromoBannerRequest: MessageTypeDefinition;
    PromoBannerResponse: MessageTypeDefinition;
    Slider: MessageTypeDefinition;
  };
  tag: {
    Tag: MessageTypeDefinition;
  };
  tax: {
    AppliesTo: MessageTypeDefinition;
    Tax: MessageTypeDefinition;
    TaxedCountries: MessageTypeDefinition;
    ZipCodeRange: MessageTypeDefinition;
  };
}
