// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { LanguageRequest as _language_LanguageRequest, LanguageRequest__Output as _language_LanguageRequest__Output } from '../language/LanguageRequest';
import type { LanguageResponse as _language_LanguageResponse, LanguageResponse__Output as _language_LanguageResponse__Output } from '../language/LanguageResponse';

export interface LanguageServiceRoutesClient extends grpc.Client {
  getLanguage(argument: _language_LanguageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_language_LanguageResponse__Output>): grpc.ClientUnaryCall;
  getLanguage(argument: _language_LanguageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_language_LanguageResponse__Output>): grpc.ClientUnaryCall;
  getLanguage(argument: _language_LanguageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_language_LanguageResponse__Output>): grpc.ClientUnaryCall;
  getLanguage(argument: _language_LanguageRequest, callback: grpc.requestCallback<_language_LanguageResponse__Output>): grpc.ClientUnaryCall;
  getLanguage(argument: _language_LanguageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_language_LanguageResponse__Output>): grpc.ClientUnaryCall;
  getLanguage(argument: _language_LanguageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_language_LanguageResponse__Output>): grpc.ClientUnaryCall;
  getLanguage(argument: _language_LanguageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_language_LanguageResponse__Output>): grpc.ClientUnaryCall;
  getLanguage(argument: _language_LanguageRequest, callback: grpc.requestCallback<_language_LanguageResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface LanguageServiceRoutesHandlers extends grpc.UntypedServiceImplementation {
  getLanguage: grpc.handleUnaryCall<_language_LanguageRequest__Output, _language_LanguageResponse>;
  
}

export interface LanguageServiceRoutesDefinition extends grpc.ServiceDefinition {
  getLanguage: MethodDefinition<_language_LanguageRequest, _language_LanguageResponse, _language_LanguageRequest__Output, _language_LanguageResponse__Output>
}
