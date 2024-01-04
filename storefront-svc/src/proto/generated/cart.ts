import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  attribute: {
    Attribute: MessageTypeDefinition;
    AttributeValue: MessageTypeDefinition;
  };
  cart: {
    Cart: MessageTypeDefinition;
    Discount: MessageTypeDefinition;
    Item: MessageTypeDefinition;
    Total: MessageTypeDefinition;
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
    Discount: MessageTypeDefinition;
    FinalPrice: MessageTypeDefinition;
    Geo: MessageTypeDefinition;
    Metadata: MessageTypeDefinition;
    PaymentConfiguration: MessageTypeDefinition;
    Shipments: MessageTypeDefinition;
    ShippingAddress: MessageTypeDefinition;
    StepsConfig: MessageTypeDefinition;
    Summary: MessageTypeDefinition;
    Tax: MessageTypeDefinition;
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
  media: {
    Image: MessageTypeDefinition;
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
  tag: {
    Tag: MessageTypeDefinition;
  };
}
