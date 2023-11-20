import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { CategoryServiceRoutesClient as _ServiceRoutes_CategoryServiceRoutesClient, CategoryServiceRoutesDefinition as _ServiceRoutes_CategoryServiceRoutesDefinition } from './ServiceRoutes/CategoryServiceRoutes';
import type { ConfigServiceRoutesClient as _ServiceRoutes_ConfigServiceRoutesClient, ConfigServiceRoutesDefinition as _ServiceRoutes_ConfigServiceRoutesDefinition } from './ServiceRoutes/ConfigServiceRoutes';
import type { LanguageServiceRoutesClient as _ServiceRoutes_LanguageServiceRoutesClient, LanguageServiceRoutesDefinition as _ServiceRoutes_LanguageServiceRoutesDefinition } from './ServiceRoutes/LanguageServiceRoutes';
import type { PageServiceRoutesClient as _ServiceRoutes_PageServiceRoutesClient, PageServiceRoutesDefinition as _ServiceRoutes_PageServiceRoutesDefinition } from './ServiceRoutes/PageServiceRoutes';
import type { ProductServiceRoutesClient as _ServiceRoutes_ProductServiceRoutesClient, ProductServiceRoutesDefinition as _ServiceRoutes_ProductServiceRoutesDefinition } from './ServiceRoutes/ProductServiceRoutes';
import type { SliderServiceRoutesClient as _ServiceRoutes_SliderServiceRoutesClient, SliderServiceRoutesDefinition as _ServiceRoutes_SliderServiceRoutesDefinition } from './ServiceRoutes/SliderServiceRoutes';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  ServiceRoutes: {
    CategoryServiceRoutes: SubtypeConstructor<typeof grpc.Client, _ServiceRoutes_CategoryServiceRoutesClient> & { service: _ServiceRoutes_CategoryServiceRoutesDefinition }
    ConfigServiceRoutes: SubtypeConstructor<typeof grpc.Client, _ServiceRoutes_ConfigServiceRoutesClient> & { service: _ServiceRoutes_ConfigServiceRoutesDefinition }
    LanguageServiceRoutes: SubtypeConstructor<typeof grpc.Client, _ServiceRoutes_LanguageServiceRoutesClient> & { service: _ServiceRoutes_LanguageServiceRoutesDefinition }
    PageServiceRoutes: SubtypeConstructor<typeof grpc.Client, _ServiceRoutes_PageServiceRoutesClient> & { service: _ServiceRoutes_PageServiceRoutesDefinition }
    ProductServiceRoutes: SubtypeConstructor<typeof grpc.Client, _ServiceRoutes_ProductServiceRoutesClient> & { service: _ServiceRoutes_ProductServiceRoutesDefinition }
    SliderServiceRoutes: SubtypeConstructor<typeof grpc.Client, _ServiceRoutes_SliderServiceRoutesClient> & { service: _ServiceRoutes_SliderServiceRoutesDefinition }
  }
  attribute: {
    Attribute: MessageTypeDefinition
    AttributeValue: MessageTypeDefinition
  }
  category: {
    Breadcrumbs: MessageTypeDefinition
    Category: MessageTypeDefinition
    CategoryRequest: MessageTypeDefinition
    CategoryResponse: MessageTypeDefinition
    Menu: MessageTypeDefinition
    MenuRequest: MessageTypeDefinition
    MenuResponse: MessageTypeDefinition
  }
  commons: {
    Currency: MessageTypeDefinition
    GoogleAnalytics: MessageTypeDefinition
    Icon: MessageTypeDefinition
    Seo: MessageTypeDefinition
    Social: MessageTypeDefinition
    Unit: MessageTypeDefinition
  }
  enum: {
    attributeTypeEnum: EnumTypeDefinition
    discountTypeEnum: EnumTypeDefinition
    productTypeEnum: EnumTypeDefinition
  }
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition
    }
  }
  language: {
    Language: MessageTypeDefinition
    LanguageRequest: MessageTypeDefinition
    LanguageResponse: MessageTypeDefinition
    Translation: MessageTypeDefinition
  }
  media: {
    Image: MessageTypeDefinition
  }
  page: {
    Page: MessageTypeDefinition
    PageRequest: MessageTypeDefinition
    PageResponse: MessageTypeDefinition
  }
  product: {
    CategoryProductsRequest: MessageTypeDefinition
    PopularProductsRequest: MessageTypeDefinition
    Product: MessageTypeDefinition
    ProductRequest: MessageTypeDefinition
    ProductResponse: MessageTypeDefinition
    ProductSeo: MessageTypeDefinition
    ProductShippingInfo: MessageTypeDefinition
    ProductsResponse: MessageTypeDefinition
    Unit: MessageTypeDefinition
    Variation: MessageTypeDefinition
    VariationOption: MessageTypeDefinition
  }
  settings: {
    ConfigRequest: MessageTypeDefinition
    ConfigResponse: MessageTypeDefinition
    Settings: MessageTypeDefinition
  }
  slides: {
    HeroSlide: MessageTypeDefinition
    HeroSlideStyle: MessageTypeDefinition
    HeroSlidesRequest: MessageTypeDefinition
    HeroSlidesResponse: MessageTypeDefinition
    PromoBanner: MessageTypeDefinition
    PromoBannerRequest: MessageTypeDefinition
    PromoBannerResponse: MessageTypeDefinition
    Slider: MessageTypeDefinition
  }
  tag: {
    Tag: MessageTypeDefinition
  }
}

