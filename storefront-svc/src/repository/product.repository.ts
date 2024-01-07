import PostgresClient from '@database';
import type {
  CategoryType,
  ImageType,
  ProductShippingInfo,
  ProductTranslationType,
  ProductType,
  ProductVariationOptions,
  TagType,
  VariationType,
} from '@ts-types/interfaces';
import { Service } from 'typedi';
import { Product__Output } from '@proto/generated/product/Product';
import { ProductCacheStore } from '@cache/product.store';
import { ProductQueries } from '@sql';

interface ProductInterface extends ProductType {
  maxComparePrice: number;
  minComparePrice: number;
  maxSalePrice: number;
  minSalePrice: number;
  salePrice: number;
  comparePrice: number;
}

@Service()
export default class ProductRepository extends PostgresClient {
  /**
   * @param {ProductQueries} productQueries
   */
  constructor(
    protected productQueries: ProductQueries,
    protected productCacheStore: ProductCacheStore
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<ProductRequest, ProductResponse>} call
   * @returns {Promise<ProductInterface>}
   */
  public getProduct = async ({
    id,
    alias,
    storeLanguageId,
    storeId,
  }: {
    id: number;
    alias: string;
    storeLanguageId: number;
    storeId?: string;
  }): Promise<{ product: Product__Output | null; error: any }> => {
    const {
      getProductTranslation,
      getProductGallery,
      getProductContentById,
      getProductShippingInfo,
      getStoreProductCategories,
      getProductTags,
      getProductVariationOptions,
      getProductVariationForStore,
      getStoreProductRelatedProducts,
      getStoreProductUpsellProducts,
    } = this.productQueries;

    /** Check if resource is in the cache store */
    const resource = (await this.productCacheStore.getProductById({ id })) as {
      product: Product__Output | null;
    };

    if (!!resource?.product) {
      return { ...resource, error: null };
    }

    const client = await this.transaction();

    try {
      // TODO use promise.all
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: store?.error,
          product: null,
        };
      }

      const productId = id;

      const results = await Promise.all([
        client.query<ProductInterface>(getProductContentById(id)), // ProductContent
        client.query<ProductTranslationType>(
          getProductTranslation(productId, storeLanguageId)
        ), // Translation
        client.query<ImageType>(getProductGallery(productId, true)), // Thumbnail
        client.query<ImageType>(getProductGallery(productId, false)), // Gallery
        client.query<ProductShippingInfo>(getProductShippingInfo(productId)), // ProductShippingInfo
        client.query<CategoryType>(
          getStoreProductCategories(productId, storeLanguageId)
        ), // ProductCategory
        client.query<TagType>(getProductTags(productId, storeLanguageId)), // ProductTag
        client.query<ProductVariationOptions>(
          getProductVariationOptions(productId)
        ), // variationOptions
        client.query<VariationType>(
          getProductVariationForStore(productId, storeLanguageId)
        ), // variations
        client.query<ProductInterface>(
          getStoreProductRelatedProducts(productId, storeLanguageId)
        ), // relatedProducts
        client.query<ProductInterface>(
          getStoreProductUpsellProducts(productId, storeLanguageId)
        ), // upsellProducts
        client.query<ProductInterface>(
          getStoreProductUpsellProducts(productId, storeLanguageId)
        ), // crossSellProducts
      ]);

      const [
        { rows: productContent },
        { rows: productTranslationRows },
        { rows: thumbnail },
        { rows: gallery },
        { rows: productShippingInfoRows },
        { rows: categories },
        { rows: tags },
        { rows: variationOptions },
        { rows: variations },
        { rows: relatedProductRows },
        { rows: upsellProductRows },
        { rows: crossSellProductRows },
      ] = results;

      const content = productContent[0] ?? {};
      const productTranslation = productTranslationRows[0] ?? {};
      const productShippingInfo = productShippingInfoRows[0];
      const relatedProducts = relatedProductRows?.map((product) => ({
        ...product,
        price: {
          maxComparePrice: product?.maxComparePrice,
          minComparePrice: product?.minComparePrice,
          maxSalePrice: product?.maxSalePrice,
          minSalePrice: product?.minSalePrice,
          salePrice: product?.salePrice,
          comparePrice: product?.comparePrice,
        },
      }));
      const upsellProducts = upsellProductRows?.map((product) => ({
        ...product,
        price: {
          maxComparePrice: product?.maxComparePrice,
          minComparePrice: product?.minComparePrice,
          maxSalePrice: product?.maxSalePrice,
          minSalePrice: product?.minSalePrice,
          salePrice: product?.salePrice,
          comparePrice: product?.comparePrice,
        },
      }));
      const crossSellProducts = crossSellProductRows?.map((product) => ({
        ...product,
        price: {
          maxComparePrice: product?.maxComparePrice,
          minComparePrice: product?.minComparePrice,
          maxSalePrice: product?.maxSalePrice,
          minSalePrice: product?.minSalePrice,
          salePrice: product?.salePrice,
          comparePrice: product?.comparePrice,
        },
      }));

      const slug = content.slug!;

      const product = {
        ...content,
        name: productTranslation?.name,
        description: productTranslation?.description,
        thumbnail,
        gallery,
        categories,
        tags,
        variationOptions,
        variations,
        productSeo: {
          slug,
          metaImage: content?.metaImage,
          ...productTranslation,
        },
        productShippingInfo,
        relatedProducts,
        upsellProducts,
        crossSellProducts,
        price: {
          salePrice: content?.salePrice,
          comparePrice: content?.comparePrice,
        },
      } as unknown as Product__Output;

      /** Set the resources in the cache store */
      this.productCacheStore.setProduct({
        store: { alias: store?.alias!, storeId: store?.storeId! },
        id: productId,
        slug,
        resource: product,
      });

      await client.query('COMMIT');

      return {
        product,
        error: null,
      };
    } catch (error: any) {
      console.log(error);
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: { message },
        product: null,
      };
    } finally {
      client.release();
    }
  };
}
