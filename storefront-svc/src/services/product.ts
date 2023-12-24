import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { CategoryQueries, ProductQueries, SettingsQueries } from '@sql';
import {
  CategoryType,
  CurrencyType,
  ImageType,
  ProductShippingInfo,
  ProductTranslationType,
  ProductType,
  ProductVariationOptions,
  SettingsType,
  SuppliersType,
  TagType,
  VariationType,
} from '@ts-types/interfaces';
import { offset } from '@utils/index';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ResourceHandler } from '@cache/resource.store';
import { PopularProductsRequest } from '@proto/generated/product/PopularProductsRequest';
import { ProductsResponse } from '@proto/generated/product/ProductsResponse';
import { Product__Output } from '@proto/generated/product/Product';
import { CategoryProductsRequest } from '@proto/generated/product/CategoryProductsRequest';
import { ProductRequest } from '@proto/generated/product/ProductRequest';
import { ProductResponse } from '@proto/generated/product/ProductResponse';
import { productTypeEnum } from '@proto/generated/enum/productTypeEnum';

interface ProductInterface extends Product__Output {
  maxComparePrice: number;
  minComparePrice: number;
  maxPrice: number;
  minPrice: number;
  salePrice: number;
  comparePrice: number;
}

const roundTo3 = (v: number = 0) => Math.round(v * 1000) / 1000;
const calcTaxRate = (price: number = 0, rate: number = 0) =>
  roundTo3(Number(price) + Number(price) * (Number(rate) / 100));
const calcPercentage = (salePrice: number = 0, comparePrice: number = 0) =>
  roundTo3(
    ((Number(comparePrice) - Number(salePrice)) / Number(comparePrice)) * 100
  );

const calcPriceRange = (
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

@Service()
export default class ProductHandler extends PostgresClient {
  /**
   * @param {ProductQueries} productQueries
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected productQueries: ProductQueries,
    protected settingsQueries: SettingsQueries,
    protected categoryQueries: CategoryQueries,
    protected resourceHandler: ResourceHandler
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<PopularProductsRequest, ProductsResponse>} call
   * @returns {Promise<Product__Output[]>}
   */
  public getPopularProducts = async (
    call: ServerUnaryCall<PopularProductsRequest, ProductsResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { products: Product__Output[] | null };
  }> => {
    const { getPopularProducts } = this.productQueries;
    const { getStorTaxRate, getStoreSystemCurrency } = this.settingsQueries;
    const { alias, storeId, storeLanguageId } = call.request;

    if (!alias || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { products: [] },
      };
    }

    /** Check if resource is in the cache store */
    // const resource = (await this.resourceHandler.getResource({
    //   alias,
    //   resourceName: 'popularProducts',
    //   packageName: 'products',
    // })) as { products: Product__Output[] | null };

    // if (resource) {
    //   return { error: null, response: resource };
    // }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      await this.setupStoreSessions(client, { alias, storeId });

      const { rows: taxRateRows } = await client.query<{ rate: number }>(
        getStorTaxRate()
      );
      const { rows: systemCurrencyRows } = await client.query<{
        systemCurrency: CurrencyType;
      }>(getStoreSystemCurrency());

      const { rate } = taxRateRows[0] ?? {};
      const { systemCurrency } = systemCurrencyRows[0] ?? {};

      const { rows } = await client.query<ProductInterface>(
        getPopularProducts(storeLanguageId)
      );

      const products = rows;

      /** Set the resources in the cache store */
      // if (products && alias) {
      //   this.resourceHandler.setResource({
      //     alias,
      //     resource: products,
      //     resourceName: 'popularProducts',
      //     packageName: 'products',
      //   });
      // }

      const results = products?.map((product) => {
        return {
          ...product,
          ...calcPriceRange(product, systemCurrency, rate),
        };
      });

      await client.query('COMMIT');

      return {
        response: {
          // @ts-ignore
          products: results,
        },
        error: null,
      };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { products: [] },
      };
    } finally {
      client.release();
    }
  };

  /**
   * @param { ServerUnaryCall<CategoryProductsRequest, ProductsResponse>} call
   * @returns {Promise<Product__Output[]>}
   */
  public getCategoryProducts = async (
    call: ServerUnaryCall<CategoryProductsRequest, ProductsResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { products: Product__Output[] | null };
  }> => {
    const { getCategoryProducts } = this.productQueries;
    const { getStoreCategoryIdByUrlKey } = this.categoryQueries;

    const { alias, storeId, storeLanguageId, urlKey, page = 0 } = call.request;

    const limit = 5;

    if (!alias || !urlKey || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { products: [] },
      };
    }

    /** Check if resource is in the cache store */
    // const resource = (await this.resourceHandler.getResource({
    //   alias,
    //   resourceName: urlKey,
    //   packageName: 'products',
    //   page,
    // })) as { products: Product__Output[] | null };

    // if (resource) {
    //   return { error: null, response: resource };
    // }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      await this.setupStoreSessions(client, { alias, storeId });

      const { rows: category } = await client.query<{ id: number }>(
        getStoreCategoryIdByUrlKey(urlKey)
      );

      const { id: categoryId } = category[0] ?? {};

      if (!categoryId) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: 'Category does not exist',
          },
          response: { products: [] },
        };
      }

      const { rows } = await client.query<Product__Output>(
        getCategoryProducts(
          categoryId,
          storeLanguageId,
          limit,
          offset(page, limit)
        )
      );

      const products = rows;

      await client.query('COMMIT');

      return { response: { products }, error: null };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { products: [] },
      };
    } finally {
      client.release();
    }
  };

  /**
   * @param { ServerUnaryCall<ProductRequest, ProductResponse>} call
   * @returns {Promise<Product__Output>}
   */
  public getProduct = async (
    call: ServerUnaryCall<ProductRequest, ProductResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { product: Product__Output | ProductType | null };
  }> => {
    const {
      getProductTranslation,
      getProductGallery,
      getProductContent,
      getProductShippingInfo,
      getStoreProductCategories,
      getProductTags,
      getProductVariationOptions,
      getProductVariationForStore,
      getStoreProductRelatedProducts,
      getStoreProductUpsellProducts,
    } = this.productQueries;
    const { getStorTaxRate, getStoreSystemCurrency } = this.settingsQueries;

    const { alias, storeId, storeLanguageId, slug } = call.request;

    if (!alias || !slug || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier or slug are not defined',
        },
        response: { product: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: slug,
      packageName: 'product',
    })) as { product: Product__Output | ProductType | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      // TODO use promise.all
      await client.query('BEGIN');

      await this.setupStoreSessions(client, { alias, storeId });

      // ProductContent
      const { rows: productContent } = await client.query<ProductType>(
        getProductContent(slug)
      );

      const content = productContent[0] ?? {};

      const isVariable = content?.type === productTypeEnum.variable;
      const isSimple = content?.type === productTypeEnum.simple;

      const { id: productId } = content;

      // Translation
      const { rows: productTranslationRows } =
        await client.query<ProductTranslationType>(
          getProductTranslation(productId, storeLanguageId)
        );

      const productTranslation = productTranslationRows[0] ?? {};

      // Thumbnail
      const { rows: thumbnail } = await client.query<ImageType>(
        getProductGallery(productId, true)
      );

      // Gallery
      const { rows: gallery } = await client.query<ImageType>(
        getProductGallery(productId, false)
      );

      // ProductShippingInfo
      const { rows: productShippingInfoRows } =
        await client.query<ProductShippingInfo>(
          getProductShippingInfo(productId)
        );

      const productShippingInfo = productShippingInfoRows[0];

      // ProductCategory
      const { rows: categories } = await client.query<CategoryType>(
        getStoreProductCategories(productId, storeLanguageId)
      );

      // ProductTag
      // const { rows: tags } = await client.query<TagType>(getProductTags(id));

      // variationOptions
      const { rows: variationOptionsRows } =
        await client.query<ProductVariationOptions>(
          getProductVariationOptions(productId)
        );

      // variations
      const { rows: variations } = await client.query<VariationType>(
        getProductVariationForStore(productId, storeLanguageId)
      );

      // relatedProducts
      const { rows: relatedProductsRows } =
        await client.query<ProductInterface>(
          getStoreProductRelatedProducts(productId, storeLanguageId)
        );

      // upsellProducts
      const { rows: upsellProductsRows } = await client.query<ProductInterface>(
        getStoreProductUpsellProducts(productId, storeLanguageId)
      );

      // crossSellProducts
      const { rows: crossSellProductsRows } =
        await client.query<ProductInterface>(
          getStoreProductUpsellProducts(productId, storeLanguageId)
        );

      const { rows: taxRateRows } = await client.query<{ rate: number }>(
        getStorTaxRate()
      );
      const { rows: systemCurrencyRows } = await client.query<{
        systemCurrency: CurrencyType;
      }>(getStoreSystemCurrency());

      const { rate } = taxRateRows[0] ?? {};
      const { systemCurrency } = systemCurrencyRows[0] ?? {};

      const variationOptions = variationOptionsRows?.map((option) => {
        return {
          ...option,
          price: {
            finalPrice: {
              currency: {
                code: systemCurrency?.code,
              },
              value: calcTaxRate(option?.salePrice!, rate),
            },
            finalPriceExclTax: {
              currency: {
                code: systemCurrency?.code,
              },
              value: option?.salePrice,
            },
            discount: {
              amountOff: calcTaxRate(option?.comparePrice, rate),
              percentOff: calcPercentage(
                calcTaxRate(option?.salePrice, rate),
                calcTaxRate(option?.comparePrice, rate)
              ),
            },
          },
        };
      });

      const relatedProducts = relatedProductsRows?.map((product) => {
        return {
          ...product,
          ...calcPriceRange(product, systemCurrency, rate),
        };
      });
      const upsellProducts = upsellProductsRows?.map((product) => {
        return {
          ...product,
          ...calcPriceRange(product, systemCurrency, rate),
        };
      });
      const crossSellProducts = crossSellProductsRows?.map((product) => {
        return {
          ...product,
          ...calcPriceRange(product, systemCurrency, rate),
        };
      });

      const product = {
        ...content,
        name: productTranslation?.name,
        description: productTranslation?.description,
        thumbnail,
        gallery,
        categories,
        // tags,
        variationOptions,
        variations,
        productSeo: {
          slug: content.slug,
          metaImage: content?.metaImage,
          ...productTranslation,
        },
        productShippingInfo,
        relatedProducts,
        upsellProducts,
        crossSellProducts,
        ...{
          ...(isSimple
            ? {
                price: {
                  finalPrice: {
                    currency: {
                      code: systemCurrency?.code,
                    },
                    value: calcTaxRate(content?.salePrice!, rate),
                  },
                  finalPriceExclTax: {
                    currency: {
                      code: systemCurrency?.code,
                    },
                    value: content?.salePrice,
                  },
                  discount: {
                    amountOff: calcTaxRate(content?.comparePrice, rate),
                    percentOff: calcPercentage(
                      calcTaxRate(content?.salePrice, rate),
                      calcTaxRate(content?.comparePrice, rate)
                    ),
                  },
                },
              }
            : {}),
        },
      };

      await client.query('COMMIT');

      return {
        // @ts-ignore
        response: { product },
        error: null,
      };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { product: null },
      };
    } finally {
      client.release();
    }
  };
}
