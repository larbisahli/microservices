import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition;
    };
  };
  photoPackage: {
    Image: MessageTypeDefinition;
  };
  userPackage: {
    Permissions: MessageTypeDefinition;
    Privileges: MessageTypeDefinition;
    Resource: MessageTypeDefinition;
    Resources: MessageTypeDefinition;
    Role: MessageTypeDefinition;
    Store: MessageTypeDefinition;
    User: MessageTypeDefinition;
  };
}
