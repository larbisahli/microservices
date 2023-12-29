import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
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
  settings: {
    ConfigRequest: MessageTypeDefinition;
    ConfigResponse: MessageTypeDefinition;
    Settings: MessageTypeDefinition;
  };
  tax: {
    AppliesTo: MessageTypeDefinition;
    Tax: MessageTypeDefinition;
    TaxedCountries: MessageTypeDefinition;
    ZipCodeRange: MessageTypeDefinition;
  };
}
