// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ShippingRequest as _shipping_ShippingRequest, ShippingRequest__Output as _shipping_ShippingRequest__Output } from '../shipping/ShippingRequest';
import type { ShippingResponse as _shipping_ShippingResponse, ShippingResponse__Output as _shipping_ShippingResponse__Output } from '../shipping/ShippingResponse';

export interface ShippingServiceRoutesClient extends grpc.Client {
  getAvailableShippings(argument: _shipping_ShippingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_shipping_ShippingResponse__Output>): grpc.ClientUnaryCall;
  getAvailableShippings(argument: _shipping_ShippingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_shipping_ShippingResponse__Output>): grpc.ClientUnaryCall;
  getAvailableShippings(argument: _shipping_ShippingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_shipping_ShippingResponse__Output>): grpc.ClientUnaryCall;
  getAvailableShippings(argument: _shipping_ShippingRequest, callback: grpc.requestCallback<_shipping_ShippingResponse__Output>): grpc.ClientUnaryCall;
  getAvailableShippings(argument: _shipping_ShippingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_shipping_ShippingResponse__Output>): grpc.ClientUnaryCall;
  getAvailableShippings(argument: _shipping_ShippingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_shipping_ShippingResponse__Output>): grpc.ClientUnaryCall;
  getAvailableShippings(argument: _shipping_ShippingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_shipping_ShippingResponse__Output>): grpc.ClientUnaryCall;
  getAvailableShippings(argument: _shipping_ShippingRequest, callback: grpc.requestCallback<_shipping_ShippingResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ShippingServiceRoutesHandlers extends grpc.UntypedServiceImplementation {
  getAvailableShippings: grpc.handleUnaryCall<_shipping_ShippingRequest__Output, _shipping_ShippingResponse>;
  
}

export interface ShippingServiceRoutesDefinition extends grpc.ServiceDefinition {
  getAvailableShippings: MethodDefinition<_shipping_ShippingRequest, _shipping_ShippingResponse, _shipping_ShippingRequest__Output, _shipping_ShippingResponse__Output>
}
