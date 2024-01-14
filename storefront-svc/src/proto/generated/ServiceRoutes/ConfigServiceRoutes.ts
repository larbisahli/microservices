// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ConfigRequest as _settings_ConfigRequest, ConfigRequest__Output as _settings_ConfigRequest__Output } from '../settings/ConfigRequest';
import type { ConfigResponse as _settings_ConfigResponse, ConfigResponse__Output as _settings_ConfigResponse__Output } from '../settings/ConfigResponse';

export interface ConfigServiceRoutesClient extends grpc.Client {
  getConfig(argument: _settings_ConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_settings_ConfigResponse__Output>): grpc.ClientUnaryCall;
  getConfig(argument: _settings_ConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_settings_ConfigResponse__Output>): grpc.ClientUnaryCall;
  getConfig(argument: _settings_ConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_settings_ConfigResponse__Output>): grpc.ClientUnaryCall;
  getConfig(argument: _settings_ConfigRequest, callback: grpc.requestCallback<_settings_ConfigResponse__Output>): grpc.ClientUnaryCall;
  getConfig(argument: _settings_ConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_settings_ConfigResponse__Output>): grpc.ClientUnaryCall;
  getConfig(argument: _settings_ConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_settings_ConfigResponse__Output>): grpc.ClientUnaryCall;
  getConfig(argument: _settings_ConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_settings_ConfigResponse__Output>): grpc.ClientUnaryCall;
  getConfig(argument: _settings_ConfigRequest, callback: grpc.requestCallback<_settings_ConfigResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ConfigServiceRoutesHandlers extends grpc.UntypedServiceImplementation {
  getConfig: grpc.handleUnaryCall<_settings_ConfigRequest__Output, _settings_ConfigResponse>;
  
}

export interface ConfigServiceRoutesDefinition extends grpc.ServiceDefinition {
  getConfig: MethodDefinition<_settings_ConfigRequest, _settings_ConfigResponse, _settings_ConfigRequest__Output, _settings_ConfigResponse__Output>
}
