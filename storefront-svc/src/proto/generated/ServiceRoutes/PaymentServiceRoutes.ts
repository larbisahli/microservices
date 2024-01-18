// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  StipePaymentRequest as _payment_StipePaymentRequest,
  StipePaymentRequest__Output as _payment_StipePaymentRequest__Output,
} from '../payment/StipePaymentRequest';
import type {
  StipePaymentResponse as _payment_StipePaymentResponse,
  StipePaymentResponse__Output as _payment_StipePaymentResponse__Output,
} from '../payment/StipePaymentResponse';

export interface PaymentServiceRoutesClient extends grpc.Client {
  getStripeClientSecret(
    argument: _payment_StipePaymentRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_StipePaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getStripeClientSecret(
    argument: _payment_StipePaymentRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_StipePaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getStripeClientSecret(
    argument: _payment_StipePaymentRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_StipePaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getStripeClientSecret(
    argument: _payment_StipePaymentRequest,
    callback: grpc.requestCallback<_payment_StipePaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getStripeClientSecret(
    argument: _payment_StipePaymentRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_StipePaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getStripeClientSecret(
    argument: _payment_StipePaymentRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_StipePaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getStripeClientSecret(
    argument: _payment_StipePaymentRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_StipePaymentResponse__Output>
  ): grpc.ClientUnaryCall;
  getStripeClientSecret(
    argument: _payment_StipePaymentRequest,
    callback: grpc.requestCallback<_payment_StipePaymentResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface PaymentServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getStripeClientSecret: grpc.handleUnaryCall<
    _payment_StipePaymentRequest__Output,
    _payment_StipePaymentResponse
  >;
}

export interface PaymentServiceRoutesDefinition extends grpc.ServiceDefinition {
  getStripeClientSecret: MethodDefinition<
    _payment_StipePaymentRequest,
    _payment_StipePaymentResponse,
    _payment_StipePaymentRequest__Output,
    _payment_StipePaymentResponse__Output
  >;
}
