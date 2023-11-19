import type * as grpc from '@grpc/grpc-js';
import type {
  EnumTypeDefinition,
  MessageTypeDefinition,
} from '@grpc/proto-loader';

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
  category: {
    Breadcrumbs: MessageTypeDefinition;
    Category: MessageTypeDefinition;
    CategoryRequest: MessageTypeDefinition;
    CategoryResponse: MessageTypeDefinition;
    Menu: MessageTypeDefinition;
    MenuRequest: MessageTypeDefinition;
    MenuResponse: MessageTypeDefinition;
  };
  enum: {
    attributeTypeEnum: EnumTypeDefinition;
    discountTypeEnum: EnumTypeDefinition;
    productTypeEnum: EnumTypeDefinition;
  };
  media: {
    Image: MessageTypeDefinition;
  };
  product: {
    CategoryProductsRequest: MessageTypeDefinition;
    PopularProductsRequest: MessageTypeDefinition;
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
