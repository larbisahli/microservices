/**
 * Serves storefront-server
 */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Service, Container } from 'typedi';
import CategoryHandler from './category';
import { MenuRequest } from '@proto/generated/categoryPackage/MenuRequest';
import { MenuResponse } from '@proto/generated/categoryPackage/MenuResponse';
import { ProtoGrpcType } from '@proto/generated/serviceRoutes';
import { Menu__Output } from '@proto/generated/categoryPackage/Menu';
import { HeroBannerRequest } from '@proto/generated/slidePackage/HeroBannerRequest';
import { HeroBannerResponse } from '@proto/generated/slidePackage/HeroBannerResponse';
import { HeroBanner__Output } from '@proto/generated/slidePackage/HeroBanner';
import SlideHandler from './slider';
import { Product__Output } from '@proto/generated/productPackage/Product';
import ProductHandler from './product';
import { PopularProductsRequest } from '@proto/generated/productPackage/PopularProductsRequest';
import { ProductRequest } from '@proto/generated/productPackage/ProductRequest';
import { ProductType } from '@ts-types/interfaces';
import { ProductResponse } from '@proto/generated/productPackage/ProductResponse';
import ConfigHandler from './config';
import { Settings__Output } from '@proto/generated/SettingsPackage/Settings';
import { StoreConfigResponse } from '@proto/generated/SettingsPackage/StoreConfigResponse';
import { StoreConfigRequest } from '@proto/generated/SettingsPackage/StoreConfigRequest';
import { CategoryRequest } from '@proto/generated/categoryPackage/CategoryRequest';
import { CategoryResponse } from '@proto/generated/categoryPackage/CategoryResponse';
import { Category } from '@proto/generated/categoryPackage/Category';
import { CategoryProductsRequest } from '@proto/generated/productPackage/CategoryProductsRequest';
import { ProductsResponse } from '@proto/generated/productPackage/ProductsResponse';
import { PromoBannerRequest } from '@proto/generated/slidePackage/PromoBannerRequest';
import { PromoBannerResponse } from '@proto/generated/slidePackage/PromoBannerResponse';
import { StorePromoBanner } from '@proto/generated/slidePackage/StorePromoBanner';
import PageHandler from './page';
import { Page } from '@proto/generated/PagePackage/Page';
import { StorePageRequest } from '@proto/generated/PagePackage/StorePageRequest';
import { StorePageResponse } from '@proto/generated/PagePackage/StorePageResponse';

const PROTO_PATH = './dist/proto/serviceRoutes.proto';

export const { createInsecure } = grpc.ServerCredentials;

/**
 * Suggested options for similarity to loading grpc.load behavior.
 */
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: false,
  arrays: true,
  oneofs: true,
  longs: String,
  enums: String,
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
  PageServiceRoutes,
} = ServiceRoutes;

@Service()
class gRPC extends grpc.Server {
  /**
   * @param {ProductHandler} productHandler
   * @param {CategoryHandler} categoryHandler
   * @param {SlideHandler} slideHandler
   * @param {ConfigHandler} configHandler
   * @param {PageHandler} pageHandler
   */
  constructor(
    protected productHandler: ProductHandler,
    protected categoryHandler: CategoryHandler,
    protected slideHandler: SlideHandler,
    protected configHandler: ConfigHandler,
    protected pageHandler: PageHandler
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

    this.addService(PageServiceRoutes.service, {
      getStorePage: this.getStorePage,
    });
  }

  /**
   * Store config request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {config: Settings__Output})} callback Response callback
   */
  protected getStoreConfig = async (
    call: grpc.ServerUnaryCall<StoreConfigRequest, StoreConfigResponse>,
    callback: grpc.sendUnaryData<{ config: Settings__Output | null }>
  ) => {
    const { error, config } = await this.configHandler.getStoreConfig(call);
    callback(error, { config });
  };

  /**
   * Store page request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {page: Page})} callback Response callback
   */
  protected getStorePage = async (
    call: grpc.ServerUnaryCall<StorePageRequest, StorePageResponse>,
    callback: grpc.sendUnaryData<{ page: Page | null }>
  ) => {
    const { error, page } = await this.pageHandler.getStorePage(call);
    callback(error, { page });
  };

  /**
   * Store product request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {products: Product__Output[]})} callback Response callback
   */
  protected getPopularProducts = async (
    call: grpc.ServerUnaryCall<PopularProductsRequest, ProductsResponse>,
    callback: grpc.sendUnaryData<{ products: Product__Output[] }>
  ) => {
    const { error, products } = await this.productHandler.getPopularProducts(
      call
    );
    callback(error, { products });
  };

  /**
   * Store category products request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {products: Product__Output[]})} callback Response callback
   */
  protected getCategoryProducts = async (
    call: grpc.ServerUnaryCall<CategoryProductsRequest, ProductsResponse>,
    callback: grpc.sendUnaryData<{ products: Product__Output[] }>
  ) => {
    const { error, products } = await this.productHandler.getCategoryProducts(
      call
    );
    callback(error, { products });
  };

  /**
   * Store product request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {products: Product__Output})} callback Response callback
   */
  protected getProduct = async (
    call: grpc.ServerUnaryCall<ProductRequest, ProductResponse>,
    callback: grpc.sendUnaryData<{ product: ProductType | null }>
  ) => {
    const { error, product } = await this.productHandler.getProduct(call);
    callback(error, { product });
  };

  /**
   * Store menu request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {menu: Menu__Output[]})} callback Response callback
   */
  protected getStoreMenu = async (
    call: grpc.ServerUnaryCall<MenuRequest, MenuResponse>,
    callback: grpc.sendUnaryData<{ menu: Menu__Output[] }>
  ) => {
    const { error, menu } = await this.categoryHandler.getMenu(call);
    callback(error, { menu });
  };

  /**
   * Store category request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {category: Category})} callback Response callback
   */
  protected getStoreCategory = async (
    call: grpc.ServerUnaryCall<CategoryRequest, CategoryResponse>,
    callback: grpc.sendUnaryData<{ category: Category | null }>
  ) => {
    const { error, category } = await this.categoryHandler.getStoreCategory(
      call
    );
    callback(error, { category });
  };

  /**
   * Store hero slider request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {sliders: HeroBanner__Output[]})} callback Response callback
   */
  protected getStoreHeroBanner = async (
    call: grpc.ServerUnaryCall<HeroBannerRequest, HeroBannerResponse>,
    callback: grpc.sendUnaryData<{ sliders: HeroBanner__Output[] }>
  ) => {
    const { error, sliders } = await this.slideHandler.getHeroSlider(call);
    callback(error, { sliders });
  };

  /**
   * Store Promo slider request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {banner: StorePromoBanner})} callback Response callback
   */
  protected getStorePromoBanner = async (
    call: grpc.ServerUnaryCall<PromoBannerRequest, PromoBannerResponse>,
    callback: grpc.sendUnaryData<{ banner: StorePromoBanner | null }>
  ) => {
    const { error, banner } = await this.slideHandler.getPromoSlider(call);
    callback(error, { banner });
  };
}

export default Container.get(gRPC);
