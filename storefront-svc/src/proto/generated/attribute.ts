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
  enum: {
    attributeTypeEnum: EnumTypeDefinition;
    discountTypeEnum: EnumTypeDefinition;
    productTypeEnum: EnumTypeDefinition;
  };
}
