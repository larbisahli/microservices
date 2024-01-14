import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  enum: {
    attributeTypeEnum: EnumTypeDefinition
    discountTypeEnum: EnumTypeDefinition
    productTypeEnum: EnumTypeDefinition
  }
}

