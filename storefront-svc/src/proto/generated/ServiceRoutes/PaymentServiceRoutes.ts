// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  PaymentRequest as _payment_PaymentRequest,
  PaymentRequest__Output as _payment_PaymentRequest__Output,
} from '../payment/PaymentRequest';
import type {
  PaymentResponse as _payment_PaymentResponse,
  PaymentResponse__Output as _payment_PaymentResponse__Output,
} from '../payment/PaymentResponse';

export interface PaymentServiceRoutesClient extends grpc.Client {
  getAvailablePayments(
    argument: _payment_PaymentRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_PaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getAvailablePayments(
    argument: _payment_PaymentRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_PaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getAvailablePayments(
    argument: _payment_PaymentRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_PaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getAvailablePayments(
    argument: _payment_PaymentRequest,
    callback: grpc.requestCallback<_payment_PaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getAvailablePayments(
    argument: _payment_PaymentRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_PaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getAvailablePayments(
    argument: _payment_PaymentRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_PaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getAvailablePayments(
    argument: _payment_PaymentRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_PaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getAvailablePayments(
    argument: _payment_PaymentRequest,
    callback: grpc.requestCallback<_payment_PaymentResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface PaymentServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getAvailablePayments: grpc.handleUnaryCall<
    _payment_PaymentRequest__Output,
    _payment_PaymentResponse
  >;
}

export interface PaymentServiceRoutesDefinition extends grpc.ServiceDefinition {
  getAvailablePayments: MethodDefinition<
    _payment_PaymentRequest,
    _payment_PaymentResponse,
    _payment_PaymentRequest__Output,
    _payment_PaymentResponse__Output
  >;
}
