// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { PageRequest as _page_PageRequest, PageRequest__Output as _page_PageRequest__Output } from '../page/PageRequest';
import type { PageResponse as _page_PageResponse, PageResponse__Output as _page_PageResponse__Output } from '../page/PageResponse';

export interface PageServiceRoutesClient extends grpc.Client {
  getPage(argument: _page_PageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_page_PageResponse__Output>): grpc.ClientUnaryCall;
  getPage(argument: _page_PageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_page_PageResponse__Output>): grpc.ClientUnaryCall;
  getPage(argument: _page_PageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_page_PageResponse__Output>): grpc.ClientUnaryCall;
  getPage(argument: _page_PageRequest, callback: grpc.requestCallback<_page_PageResponse__Output>): grpc.ClientUnaryCall;
  getPage(argument: _page_PageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_page_PageResponse__Output>): grpc.ClientUnaryCall;
  getPage(argument: _page_PageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_page_PageResponse__Output>): grpc.ClientUnaryCall;
  getPage(argument: _page_PageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_page_PageResponse__Output>): grpc.ClientUnaryCall;
  getPage(argument: _page_PageRequest, callback: grpc.requestCallback<_page_PageResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface PageServiceRoutesHandlers extends grpc.UntypedServiceImplementation {
  getPage: grpc.handleUnaryCall<_page_PageRequest__Output, _page_PageResponse>;
  
}

export interface PageServiceRoutesDefinition extends grpc.ServiceDefinition {
  getPage: MethodDefinition<_page_PageRequest, _page_PageResponse, _page_PageRequest__Output, _page_PageResponse__Output>
}
