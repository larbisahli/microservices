// Original file: src/proto/serviceRoutes.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  CartRequest as _cart_CartRequest,
  CartRequest__Output as _cart_CartRequest__Output,
} from '../cart/CartRequest';
import type {
  CartResponse as _cart_CartResponse,
  CartResponse__Output as _cart_CartResponse__Output,
} from '../cart/CartResponse';
import type {
  CheckoutRequest as _checkout_CheckoutRequest,
  CheckoutRequest__Output as _checkout_CheckoutRequest__Output,
} from '../checkout/CheckoutRequest';
import type {
  CheckoutResponse as _checkout_CheckoutResponse,
  CheckoutResponse__Output as _checkout_CheckoutResponse__Output,
} from '../checkout/CheckoutResponse';

export interface CheckoutServiceRoutesClient extends grpc.Client {
  getClientCart(
    argument: _cart_CartRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_cart_CartResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCart(
    argument: _cart_CartRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_cart_CartResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCart(
    argument: _cart_CartRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_cart_CartResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCart(
    argument: _cart_CartRequest,
    callback: grpc.requestCallback<_cart_CartResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCart(
    argument: _cart_CartRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_cart_CartResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCart(
    argument: _cart_CartRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_cart_CartResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCart(
    argument: _cart_CartRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_cart_CartResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCart(
    argument: _cart_CartRequest,
    callback: grpc.requestCallback<_cart_CartResponse__Output>
  ): grpc.ClientUnaryCall;

  getClientCheckout(
    argument: _checkout_CheckoutRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_checkout_CheckoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCheckout(
    argument: _checkout_CheckoutRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_checkout_CheckoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCheckout(
    argument: _checkout_CheckoutRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_checkout_CheckoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCheckout(
    argument: _checkout_CheckoutRequest,
    callback: grpc.requestCallback<_checkout_CheckoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCheckout(
    argument: _checkout_CheckoutRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_checkout_CheckoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCheckout(
    argument: _checkout_CheckoutRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_checkout_CheckoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCheckout(
    argument: _checkout_CheckoutRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_checkout_CheckoutResponse__Output>
  ): grpc.ClientUnaryCall;
  getClientCheckout(
    argument: _checkout_CheckoutRequest,
    callback: grpc.requestCallback<_checkout_CheckoutResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface CheckoutServiceRoutesHandlers
  extends grpc.UntypedServiceImplementation {
  getClientCart: grpc.handleUnaryCall<
    _cart_CartRequest__Output,
    _cart_CartResponse
  >;

  getClientCheckout: grpc.handleUnaryCall<
    _checkout_CheckoutRequest__Output,
    _checkout_CheckoutResponse
  >;
}

export interface CheckoutServiceRoutesDefinition
  extends grpc.ServiceDefinition {
  getClientCart: MethodDefinition<
    _cart_CartRequest,
    _cart_CartResponse,
    _cart_CartRequest__Output,
    _cart_CartResponse__Output
  >;
  getClientCheckout: MethodDefinition<
    _checkout_CheckoutRequest,
    _checkout_CheckoutResponse,
    _checkout_CheckoutRequest__Output,
    _checkout_CheckoutResponse__Output
  >;
}
