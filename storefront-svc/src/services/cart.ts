import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { CartRequest } from '@proto/generated/cart/CartRequest';
import { CartResponse } from '@proto/generated/cart/CartResponse';
import { CartCacheStore } from '@cache/cart.store';
import { Cart } from '@proto/generated/cart/Cart';
import { isEmpty } from 'underscore';
import ProductRepository from '@repository/product.repository';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { productTypeEnum } from '@proto/generated/enum/productTypeEnum';
import PostgresClient from '@database';
import { CryptoUtils } from '@core';

@Service()
export default class CartHandler extends PostgresClient {
  /**
   * @param {CartCacheStore} cartCacheStore
   */
  constructor(
    protected cartCacheStore: CartCacheStore,
    protected productRepository: ProductRepository,
    protected cryptoUtils: CryptoUtils
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<CartRequest, CartResponse>} call
   * @returns {Promise<{ cart: Cart | null }>}
   */
  public getCart = async (
    call: ServerUnaryCall<CartRequest, CartResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { cart: Cart | null };
  }> => {
    const { cuid, alias, suid, storeLanguageId } = call.request;

    if (!alias || !cuid || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'storeId, language id or cuid are not defined',
        },
        response: { cart: null },
      };
    }

    let storeId: string | null;
    if (suid) {
      storeId = await this.cryptoUtils.decrypt(suid);
    } else {
      storeId = await this.getStoreId({ alias });
    }

    if (!storeId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'store identifier is not defined',
        },
        response: { cart: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.cartCacheStore.getClientCart({
      cartId: cuid,
    })) as { cart: Cart | null };

    if (isEmpty(resource?.cart)) {
      return {
        error: null,
        response: { cart: null },
      };
    }

    const cart = resource?.cart!;

    let items: Cart['items'] = [];

    // Get full products
    for await (const { id, ...rest } of cart?.items ?? []) {
      const { product } = await this.productRepository.getProduct({
        id: id!,
        storeId,
        storeLanguageId,
      });
      if (product) {
        const isConfigurable = product?.type === productTypeEnum.variable;
        if (isConfigurable) {
          const selectedVariationOption = product?.variationOptions?.find(
            (option) => option.id === rest?.orderVariationOption?.id
          );
          items.push({
            ...rest,
            orderVariationOption: {
              ...selectedVariationOption,
            },
            ...product,
          });
        } else {
          items.push({
            ...rest,
            ...product,
          });
        }
      }
    }

    return {
      error: null,
      response: {
        cart: {
          ...cart,
          items,
        },
      },
    };
  };
}
