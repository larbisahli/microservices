// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  StoreConfigRequest as _SettingsPackage_StoreConfigRequest,
  StoreConfigRequest__Output as _SettingsPackage_StoreConfigRequest__Output,
} from '../SettingsPackage/StoreConfigRequest';
import type {
  StoreConfigResponse as _SettingsPackage_StoreConfigResponse,
  StoreConfigResponse__Output as _SettingsPackage_StoreConfigResponse__Output,
} from '../SettingsPackage/StoreConfigResponse';

export interface ConfigServiceRoutesClient extends grpc.Client {
  getStoreConfig(
    argument: _SettingsPackage_StoreConfigRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_SettingsPackage_StoreConfigResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreConfig(
    argument: _SettingsPackage_StoreConfigRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_SettingsPackage_StoreConfigResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreConfig(
    argument: _SettingsPackage_StoreConfigRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_SettingsPackage_StoreConfigResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreConfig(
    argument: _SettingsPackage_StoreConfigRequest,
    callback: grpc.requestCallback<_SettingsPackage_StoreConfigResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreConfig(
    argument: _SettingsPackage_StoreConfigRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_SettingsPackage_StoreConfigResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreConfig(
    argument: _SettingsPackage_StoreConfigRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_SettingsPackage_StoreConfigResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreConfig(
    argument: _SettingsPackage_StoreConfigRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_SettingsPackage_StoreConfigResponse__Output>
  ): grpc.ClientUnaryCall;
  getStoreConfig(
    argument: _SettingsPackage_StoreConfigRequest,
    callback: grpc.requestCallback<_SettingsPackage_StoreConfigResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface ConfigServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getStoreConfig: grpc.handleUnaryCall<
    _SettingsPackage_StoreConfigRequest__Output,
    _SettingsPackage_StoreConfigResponse
  >;
}

export interface ConfigServiceRoutesDefinition extends grpc.ServiceDefinition {
  getStoreConfig: MethodDefinition<
    _SettingsPackage_StoreConfigRequest,
    _SettingsPackage_StoreConfigResponse,
    _SettingsPackage_StoreConfigRequest__Output,
    _SettingsPackage_StoreConfigResponse__Output
  >;
}
