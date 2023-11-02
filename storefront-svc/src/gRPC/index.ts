/**
 * Serves the storefront website (SSR)
 */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Service, Container } from 'typedi';
import { MenuRequest } from '@proto/generated/categoryPackage/MenuRequest';
import { MenuResponse } from '@proto/generated/categoryPackage/MenuResponse';
import { ProtoGrpcType } from '@proto/generated/serviceRoutes';
import { Menu__Output } from '@proto/generated/categoryPackage/Menu';
import { HeroBannerRequest } from '@proto/generated/slidePackage/HeroBannerRequest';
import { HeroBannerResponse } from '@proto/generated/slidePackage/HeroBannerResponse';
import { StoreHeroBanner__Output } from '@proto/generated/slidePackage/StoreHeroBanner';
import CategoryHandler from './handler/category';
import SlideHandler from './handler/slider';
import ProductHandler from './handler/product';
import { Product__Output } from '@proto/generated/productPackage/Product';
import { PopularProductsRequest } from '@proto/generated/productPackage/PopularProductsRequest';
import { ProductRequest } from '@proto/generated/productPackage/ProductRequest';
import { ProductResponse } from '@proto/generated/productPackage/ProductResponse';
import ConfigHandler from './handler/config';
import { Settings__Output } from '@proto/generated/SettingsPackage/Settings';
import { StoreConfigResponse } from '@proto/generated/SettingsPackage/StoreConfigResponse';
import { StoreConfigRequest } from '@proto/generated/SettingsPackage/StoreConfigRequest';
import {
  InvalidateResourceResponse,
  InvalidateResourceResponse__Output,
} from '@proto/generated/ServiceRoutes/InvalidateResourceResponse';
import { InvalidateResourceRequest } from '@proto/generated/ServiceRoutes/InvalidateResourceRequest';
import InvalidationHandler from './handler/invalidation';
import { CategoryRequest } from '@proto/generated/categoryPackage/CategoryRequest';
import { CategoryResponse } from '@proto/generated/categoryPackage/CategoryResponse';
import { Category } from '@proto/generated/categoryPackage/Category';
import { ProductsResponse } from '@proto/generated/productPackage/ProductsResponse';
import { CategoryProductsRequest } from '@proto/generated/productPackage/CategoryProductsRequest';
import { PromoBannerRequest } from '@proto/generated/slidePackage/PromoBannerRequest';
import { PromoBannerResponse } from '@proto/generated/slidePackage/PromoBannerResponse';
import { StorePromoBanner } from '@proto/generated/slidePackage/StorePromoBanner';
import PageHandler from './handler/page';
import { Page } from '@proto/generated/PagePackage/Page';
import { StorePageRequest } from '@proto/generated/PagePackage/StorePageRequest';
import { StorePageResponse } from '@proto/generated/PagePackage/StorePageResponse';

const PROTO_PATH = './build/proto/serviceRoutes.proto';

export const { createInsecure } = grpc.ServerCredentials;

/**
 * Suggested options for similarity to loading grpc.load behavior.
 */
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  arrays: true,
  defaults: false,
  oneofs: true,
});

/**
 * Grab services from the protobuf file.
 */
const { ServiceRoutes } = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const {
  CategoryServiceRoutes,
  SliderServiceRoutes,
  ProductServiceRoutes,
  ConfigServiceRoutes,
  InvalidationServiceRoutes,
  PageServiceRoutes,
} = ServiceRoutes;

@Service()
class gRPC extends grpc.Server {
  /**
   * @param {CategoryHandler} categoryHandler
   * @param {SlideHandler} slideHandler
   */
  constructor(
    protected productHandler: ProductHandler,
    protected categoryHandler: CategoryHandler,
    protected slideHandler: SlideHandler,
    protected configHandler: ConfigHandler,
    protected pageHandler: PageHandler,
    protected invalidationHandler: InvalidationHandler
  ) {
    super();

    this.addService(ProductServiceRoutes.service, {
      getPopularProducts: this.getPopularProducts,
      getCategoryProducts: this.getCategoryProducts,
      getProduct: this.getProduct,
    });

    this.addService(CategoryServiceRoutes.service, {
      getStoreMenu: this.getStoreMenu,
      getStoreCategory: this.getStoreCategory,
    });

    this.addService(SliderServiceRoutes.service, {
      getStoreHeroBanner: this.getStoreHeroBanner,
      getStorePromoBanner: this.getStorePromoBanner,
    });

    this.addService(ConfigServiceRoutes.service, {
      getStoreConfig: this.getStoreConfig,
    });

    this.addService(InvalidationServiceRoutes.service, {
      invalidateResource: this.invalidateResource,
    });

    this.addService(PageServiceRoutes.service, {
      getStorePage: this.getStorePage,
    });
  }

  /**
   * Invalidate cached requests from the mongo store.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, Settings__Output)} callback Response callback
   */
  protected invalidateResource = async (
    call: grpc.ServerUnaryCall<
      InvalidateResourceRequest,
      InvalidateResourceResponse
    >,
    callback: grpc.sendUnaryData<InvalidateResourceResponse__Output>
  ) => {
    const { error, response } = await this.invalidationHandler.invalidateCache(
      call
    );
    callback(error, response);
  };

  /**
   * Store config request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, Settings__Output)} callback Response callback
   */
  protected getStoreConfig = async (
    call: grpc.ServerUnaryCall<StoreConfigRequest, StoreConfigResponse>,
    callback: grpc.sendUnaryData<{
      config: Settings__Output | null | undefined;
    }>
  ) => {
    const { error, response } = await this.configHandler.getStoreConfig(call);
    callback(error, response);
  };

  /**
   * Store page request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, Page)} callback Response callback
   */
  protected getStorePage = async (
    call: grpc.ServerUnaryCall<StorePageRequest, StorePageResponse>,
    callback: grpc.sendUnaryData<{
      page: Page | null | undefined;
    }>
  ) => {
    const { error, response } = await this.pageHandler.getPage(call);
    callback(error, response);
  };

  /**
   * Store product request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, Product__Output[])} callback Response callback
   */
  protected getPopularProducts = async (
    call: grpc.ServerUnaryCall<PopularProductsRequest, ProductsResponse>,
    callback: grpc.sendUnaryData<{ products: Product__Output[] | null }>
  ) => {
    const { error, response } = await this.productHandler.getPopularProducts(
      call
    );
    callback(error, response);
  };

  /**
   * Store category products request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, Product__Output[])} callback Response callback
   */
  protected getCategoryProducts = async (
    call: grpc.ServerUnaryCall<CategoryProductsRequest, ProductsResponse>,
    callback: grpc.sendUnaryData<{ products: Product__Output[] | null }>
  ) => {
    const { error, response } = await this.productHandler.getCategoryProducts(
      call
    );
    callback(error, response);
  };

  /**
   * Store product request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, CategoryType[])} callback Response callback
   */
  protected getProduct = async (
    call: grpc.ServerUnaryCall<ProductRequest, ProductResponse>,
    callback: grpc.sendUnaryData<{ product: Product__Output | null }>
  ) => {
    const { error, response } = await this.productHandler.getProduct(call);
    callback(error, response);
  };

  /**
   * Store menu request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, CategoryType[])} callback Response callback
   */
  protected getStoreMenu = async (
    call: grpc.ServerUnaryCall<MenuRequest, MenuResponse>,
    callback: grpc.sendUnaryData<{ menu: Menu__Output[] | null }>
  ) => {
    const { error, response } = await this.categoryHandler.getMenu(call);
    callback(error, response);
  };

  /**
   * Store category request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, CategoryType[])} callback Response callback
   */
  protected getStoreCategory = async (
    call: grpc.ServerUnaryCall<CategoryRequest, CategoryResponse>,
    callback: grpc.sendUnaryData<{ category: Category | null }>
  ) => {
    const { error, response } = await this.categoryHandler.getStoreCategory(
      call
    );
    callback(error, response);
  };

  /**
   * Store banner request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, CategoryType[])} callback Response callback
   */
  protected getStoreHeroBanner = async (
    call: grpc.ServerUnaryCall<HeroBannerRequest, HeroBannerResponse>,
    callback: grpc.sendUnaryData<{ sliders: StoreHeroBanner__Output[] | null }>
  ) => {
    const { error, response } = await this.slideHandler.getHeroSlide(call);
    callback(error, response);
  };

  /**
   * Store banner request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, CategoryType[])} callback Response callback
   */
  protected getStorePromoBanner = async (
    call: grpc.ServerUnaryCall<PromoBannerRequest, PromoBannerResponse>,
    callback: grpc.sendUnaryData<{ banner: StorePromoBanner | null }>
  ) => {
    const { error, response } = await this.slideHandler.getPromoSlide(call);
    callback(error, response);
  };
}

export default Container.get(gRPC);
