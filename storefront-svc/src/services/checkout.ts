import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { CheckoutCacheStore } from '@cache/checkout.store';
import { CheckoutRequest } from '@proto/generated/checkout/CheckoutRequest';
import { CheckoutResponse } from '@proto/generated/checkout/CheckoutResponse';
import { Checkout } from '@proto/generated/checkout/Checkout';
import { isEmpty } from 'underscore';
import { ShippingCacheStore } from '@cache/shipping.store';
import { Status } from '@grpc/grpc-js/build/src/constants';
import ShippingRepository from '@repository/shipping.repository';
import ProductRepository from '@repository/product.repository';
import { CartCacheStore } from '@cache/cart.store';
import { Cart } from '@proto/generated/cart/Cart';
import { productTypeEnum } from '@proto/generated/enum/productTypeEnum';
import { Item } from '@proto/generated/cart/Item';
import { Shipping } from '@proto/generated/shipping/Shipping';
import { ConfigCacheStore } from '@cache/config.store';
import ConfigRepository from '@repository/config.repository';
import { Unit } from '@proto/generated/product/Unit';
import { ShippingAddress } from '@proto/generated/checkout/ShippingAddress';
import { CouponDiscountsType } from '@ts-types/interfaces';
import PostgresClient from '@database';
import { CryptoUtils } from '@core';

export enum RateTypes {
  price = 'price',
  weight = 'weight',
}

export enum UnitTypes {
  G = 'g',
  KG = 'kg',
}

export const roundTo3 = (v: number = 0) => Math.round(v * 1000) / 1000;

export const calcTaxRate = (price: number = 0, rate: number = 0) =>
  roundTo3(Number(price) + Number(price) * (Number(rate) / 100));

export const ConvertToGram = (weight: number | null, unit: Unit | null) => {
  if (!weight || !unit) return 0;
  if (unit?.unit === UnitTypes.G) {
    return Number(weight);
  } else if (unit?.unit === UnitTypes?.KG) {
    return Number(weight) * 1000;
  }
};

const getCartItemsTotalInclTaxPrice = (
  items: Item[],
  rate: number,
  shippingPrice?: number
) => {
  let total = items!.reduce((total: number, item: Item) => {
    const isVariableType = item!.type === productTypeEnum.variable;
    const selectedPrice = isVariableType
      ? calcTaxRate(Number(item?.orderVariationOption?.salePrice ?? 0), rate)
      : calcTaxRate(Number(item?.price?.salePrice ?? 0), rate);
    return total + (Number(selectedPrice) ?? 0) * item.orderQuantity!;
  }, 0);
  return roundTo3(total + (shippingPrice ?? 0));
};

const getCartItemsTotalPriceExclTax = (
  items: Item[],
  shippingPriceExclTax?: number
) => {
  let total = items!.reduce((total: number, item: Item) => {
    const isVariableType = item!.type === productTypeEnum.variable;
    const selectedTaxPrice = isVariableType
      ? item?.orderVariationOption?.salePrice
      : item.price?.salePrice;
    return total + (Number(selectedTaxPrice) ?? 0) * item.orderQuantity!;
  }, 0);
  return roundTo3(total + (shippingPriceExclTax ?? 0));
};

const getTotalShippingCost = (
  items: Item[],
  shipping: Shipping | null | undefined,
  shippingAddress: ShippingAddress | null | undefined
) => {
  const { iso2 = null } = shippingAddress?.country ?? {};
  if (!iso2) return 0;

  const zones = shipping?.zones?.map((zone) => zone.iso2);
  let rates = shipping?.rates;
  const rateType = shipping?.rateType;

  // ***** Check the shipment zone *****
  if (zones?.includes(iso2)) {
    console.log('++++++++++++++++++++++++ includes(iso2)');
  }

  // ***** Convert rates to gram *****
  if (rates && rateType === RateTypes.weight) {
    rates = rates?.map((rate) => {
      rate.min = ConvertToGram(Number(rate.min ?? 0), rate.weightUnit!);
      rate.max = ConvertToGram(Number(rate.max), rate.weightUnit!);
      return rate;
    });
  }

  const total = items!.reduce((total: number, item: Item) => {
    const { weight = null, weightUnit = null } =
      item?.productShippingInfo ?? {};
    const weightInGram = ConvertToGram(weight, weightUnit);
    return total + ((Number(weightInGram) ?? 0) * item?.orderQuantity! ?? 0);
  }, 0);

  const selectedRate = rates?.find((rate) => {
    if (rateType === RateTypes.price) {
      if (rate.min === 0 && rate.max === 0) {
        return true;
      }
    }
    return (
      Number(rate.min ?? 0) <= roundTo3(total) &&
      roundTo3(total) <= Number(rate.max ?? 0)
    );
  });

  if (rateType === RateTypes.price || rateType === RateTypes.weight) {
    const selectedPrice = selectedRate?.price;
    return Number(selectedPrice ?? 0);
  }
  return 0;
};

@Service()
export default class CheckoutHandler extends PostgresClient {
  /**
   * @param {CheckoutCacheStore} checkoutCacheStore
   */
  constructor(
    protected checkoutCacheStore: CheckoutCacheStore,
    protected shippingCacheStore: ShippingCacheStore,
    protected shippingRepository: ShippingRepository,
    protected cartCacheStore: CartCacheStore,
    protected configCacheStore: ConfigCacheStore,
    protected productRepository: ProductRepository,
    protected configRepository: ConfigRepository,
    protected cryptoUtils: CryptoUtils
  ) {
    super();
  }

  private calcShippingIncTaxRate = (
    items: Item[],
    shipping: Shipping | null | undefined,
    shippingAddress: ShippingAddress,
    rate: number
  ) => {
    if (isEmpty(shipping)) return 0;
    return calcTaxRate(
      getTotalShippingCost(items, shipping, shippingAddress),
      rate
    );
  };

  private calcShippingRateExclTax = (
    items: Item[],
    shipping: Shipping | null | undefined,
    shippingAddress: ShippingAddress
  ) => {
    if (isEmpty(shipping)) return 0;
    return getTotalShippingCost(items, shipping, shippingAddress);
  };

  private calcCheckoutSummary = ({
    shipping,
    shippingAddress,
    taxRate,
    items,
    discount,
  }: {
    shipping: Shipping | null | undefined;
    shippingAddress: ShippingAddress;
    taxRate: number;
    items: Item[];
    discount: Checkout['appliedCoupon'];
  }) => {
    let shipmentInclTaxPrice = this.calcShippingIncTaxRate(
      items,
      shipping,
      shippingAddress,
      taxRate
    );
    let shippingPriceExclTax = this.calcShippingRateExclTax(
      items,
      shipping,
      shippingAddress
    );
    let subtotalInclTax = getCartItemsTotalInclTaxPrice(items, taxRate);
    let subtotalExclTax = getCartItemsTotalPriceExclTax(items);
    let grandTotalInclTax = subtotalInclTax + shipmentInclTaxPrice;
    let grandTotalExclTax = subtotalExclTax + shippingPriceExclTax;
    let totalDiscount = 0;

    // *** DISCOUNT ***
    if (discount) {
      const discountValue = Number(discount?.discountValue ?? 0);
      const discountType = discount?.discountType;
      if (discountType === CouponDiscountsType.Fixed) {
        totalDiscount = discountValue;
        grandTotalInclTax -=
          grandTotalInclTax >= discountValue
            ? discountValue
            : grandTotalInclTax;
        grandTotalExclTax -=
          grandTotalExclTax >= discountValue
            ? discountValue
            : grandTotalExclTax;
      } else if (discountType === CouponDiscountsType.Percentage) {
        const value = roundTo3(
          Number(grandTotalInclTax) * (Number(discountValue) / 100)
        );
        totalDiscount = value;
        grandTotalInclTax -= value;
        grandTotalExclTax -= value;
      } else if (discountType === CouponDiscountsType.FreeShipping) {
        grandTotalInclTax -= shipmentInclTaxPrice;
        grandTotalExclTax -= shippingPriceExclTax;
        shipmentInclTaxPrice = 0;
        shippingPriceExclTax = 0;
      }
    }

    return {
      grandTotalInclTax: {
        value: roundTo3(grandTotalInclTax),
      },
      grandTotalExclTax: {
        value: roundTo3(grandTotalExclTax),
      },
      subtotalInclTax: {
        value: subtotalInclTax,
      },
      subtotalExclTax: {
        value: subtotalExclTax,
      },
      totalDiscount: {
        value: totalDiscount,
      },
      totalShippingInclTax: {
        value: shipmentInclTaxPrice,
      },
      totalShippingExclTax: {
        value: shippingPriceExclTax,
      },
    };
  };

  /**
   * @param { ServerUnaryCall<MenuRequest__Output, MenuResponse>} call
   * @returns {Promise<Checkout>}
   */
  public getCheckout = async (
    call: ServerUnaryCall<CheckoutRequest, CheckoutResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { checkout: Checkout | null };
  }> => {
    const { cuid, alias, suid, storeLanguageId } = call.request;

    if (!alias || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { checkout: null },
      };
    }

    if (!cuid) {
      return {
        error: null,
        response: { checkout: null },
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
        response: { checkout: null },
      };
    }

    /** Check if resource is in the cache store */
    const checkout = (await this.checkoutCacheStore.getCheckout({
      cuid,
    })) as Checkout | null;

    if (isEmpty(checkout)) {
      return {
        error: null,
        response: { checkout: null },
      };
    }

    /** Get client cart */
    const resource = (await this.cartCacheStore.getClientCart({
      cartId: cuid,
    })) as { cart: Cart | null };

    if (isEmpty(resource?.cart)) {
      return {
        error: null,
        response: { checkout: null },
      };
    }

    /** ****** Store config ****** */
    const { config, error } = await this.configRepository.getStoreConfig(
      storeId
    );

    if (error) {
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: error.message,
        },
        response: { checkout: null },
      };
    }

    if (isEmpty(config)) {
      return {
        error: null,
        response: { checkout: null },
      };
    }

    // ****** Cart ******
    let cart = resource?.cart!;
    let items: Cart['items'] = [];
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

    cart.items = items;
    let selectedShipping = null;

    // ****** Shipment ******
    if (checkout?.shipment?.id) {
      /** Check if resource is in the cache store */
      const { shippings } = await this.shippingRepository.getShippings(storeId);
      selectedShipping = shippings?.find(
        (shipping) => shipping.id === checkout?.shipment?.id
      );
      checkout.shipment = {
        id: selectedShipping?.id,
        name: selectedShipping?.name,
        deliveryTime: selectedShipping?.deliveryTime,
        freeShipping: selectedShipping?.freeShipping,
        logo: selectedShipping?.logo,
        rateType: selectedShipping?.rateType,
      };
    }

    const discount = checkout?.appliedCoupon ?? {};
    const taxRate = config?.tax?.rate!;
    checkout!.cart = cart;
    checkout!.summary = this.calcCheckoutSummary({
      shipping: selectedShipping,
      shippingAddress: checkout?.shippingAddress!,
      taxRate,
      items: cart.items,
      discount,
    });

    return { error: null, response: { checkout } };
  };
}
