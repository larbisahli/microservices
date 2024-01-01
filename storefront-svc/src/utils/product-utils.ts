import { productTypeEnum } from '@proto/generated/enum/productTypeEnum';
import { Product__Output } from '@proto/generated/product/Product';
import { CurrencyType } from '@ts-types/interfaces';

interface ProductInterface extends Product__Output {
  maxComparePrice: number;
  minComparePrice: number;
  maxPrice: number;
  minPrice: number;
  salePrice: number;
  comparePrice: number;
}

export const roundTo3 = (v: number = 0) => Math.round(v * 1000) / 1000;
export const calcTaxRate = (price: number = 0, rate: number = 0) =>
  roundTo3(Number(price) + Number(price) * (Number(rate) / 100));
export const calcPercentage = (
  salePrice: number = 0,
  comparePrice: number = 0
) =>
  roundTo3(
    ((Number(comparePrice) - Number(salePrice)) / Number(comparePrice)) * 100
  );

export const calcPriceRange = (
  product: ProductInterface,
  systemCurrency: CurrencyType,
  rate: number
) => {
  const isConfigurable = product?.type === productTypeEnum.variable;

  if (isConfigurable) {
    return {
      priceRange: {
        maximumPrice: {
          finalPrice: {
            currency: {
              code: systemCurrency?.code,
            },
            value: calcTaxRate(product?.maxPrice, rate),
          },
          finalPriceExclTax: {
            currency: {
              code: systemCurrency?.code,
            },
            value: product?.maxPrice,
          },
          discount: {
            amountOff: calcTaxRate(product?.maxComparePrice, rate),
            percentOff: calcPercentage(
              calcTaxRate(product?.maxPrice, rate),
              calcTaxRate(product?.maxComparePrice, rate)
            ),
          },
        },
        minimumPrice: {
          finalPrice: {
            currency: {
              code: systemCurrency?.code,
            },
            value: calcTaxRate(product?.minPrice, rate),
          },
          finalPriceExclTax: {
            currency: {
              code: systemCurrency?.code,
            },
            value: product?.minPrice,
          },
          discount: {
            amountOff: calcTaxRate(product?.minComparePrice, rate),
            percentOff: calcPercentage(
              calcTaxRate(product?.minPrice, rate),
              calcTaxRate(product?.minComparePrice, rate)
            ),
          },
        },
      },
    };
  }
  return {
    priceRange: {
      maximumPrice: {
        finalPrice: {
          currency: {
            code: systemCurrency?.code,
          },
          value: calcTaxRate(product?.salePrice, rate),
        },
        finalPriceExclTax: {
          currency: {
            code: systemCurrency?.code,
          },
          value: product?.salePrice,
        },
        discount: {
          amountOff: calcTaxRate(product?.comparePrice, rate),
          percentOff: calcPercentage(
            calcTaxRate(product?.salePrice, rate),
            calcTaxRate(product?.comparePrice, rate)
          ),
        },
      },
    },
  };
};
