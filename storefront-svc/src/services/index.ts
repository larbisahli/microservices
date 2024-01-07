/**
 * Serves storefront-server
 */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Service, Container } from 'typedi';
import { ProtoGrpcType } from '@proto/generated/serviceRoutes';
import SlideHandler from './slider';
import ProductHandler from './product';
import ConfigHandler from './config';
import CategoryHandler from './category';
import PageHandler from './page';
// --------------- <TYPES> ---------------
import { PromoBanner } from '@proto/generated/slides/PromoBanner';
import { ConfigRequest } from '@proto/generated/settings/ConfigRequest';
import { ConfigResponse } from '@proto/generated/settings/ConfigResponse';
import { Settings } from '@proto/generated/settings/Settings';
import { PageRequest } from '@proto/generated/page/PageRequest';
import { PageResponse } from '@proto/generated/page/PageResponse';
import { Page } from '@proto/generated/page/Page';
import { PopularProductsRequest } from '@proto/generated/product/PopularProductsRequest';
import { ProductsResponse } from '@proto/generated/product/ProductsResponse';
import { Product } from '@proto/generated/product/Product';
import { CategoryProductsRequest } from '@proto/generated/product/CategoryProductsRequest';
import { ProductRequest } from '@proto/generated/product/ProductRequest';
import { ProductResponse } from '@proto/generated/product/ProductResponse';
import { ProductType } from '@ts-types/interfaces';
import { MenuRequest__Output } from '@proto/generated/category/MenuRequest';
import { MenuResponse } from '@proto/generated/category/MenuResponse';
import { Menu, Menu__Output } from '@proto/generated/category/Menu';
import { CategoryRequest } from '@proto/generated/category/CategoryRequest';
import { CategoryResponse } from '@proto/generated/category/CategoryResponse';
import { Category, Category__Output } from '@proto/generated/category/Category';
import { HeroSlidesRequest } from '@proto/generated/slides/HeroSlidesRequest';
import { HeroSlidesResponse } from '@proto/generated/slides/HeroSlidesResponse';
import { HeroSlide } from '@proto/generated/slides/HeroSlide';
import { PromoBannerRequest } from '@proto/generated/slides/PromoBannerRequest';
import { PromoBannerResponse } from '@proto/generated/slides/PromoBannerResponse';
import { Language } from '@proto/generated/language/Language';
import { LanguageRequest } from '@proto/generated/language/LanguageRequest';
import { LanguageResponse } from '@proto/generated/language/LanguageResponse';
import { HomePageCategoryRequest__Output } from '@proto/generated/category/HomePageCategoryRequest';
import { HomePageCategoryResponse__Output } from '@proto/generated/category/HomePageCategoryResponse';
import CheckoutHandler from './checkout';
import CartHandler from './cart';
import { CheckoutRequest } from '@proto/generated/checkout/CheckoutRequest';
import { CheckoutResponse } from '@proto/generated/checkout/CheckoutResponse';
import { Cart } from '@proto/generated/cart/Cart';
import { Checkout } from '@proto/generated/checkout/Checkout';

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

export const {
  LanguageServiceRoutes,
  CategoryServiceRoutes,
  SliderServiceRoutes,
  ProductServiceRoutes,
  ConfigServiceRoutes,
  PageServiceRoutes,
  CheckoutServiceRoutes,
} = ServiceRoutes;

@Service()
class gRPC extends grpc.Server {
  /**
   * @param {ProductHandler} productHandler
   * @param {CategoryHandler} categoryHandler
   * @param {SlideHandler} slideHandler
   * @param {ConfigHandler} configHandler
   * @param {PageHandler} pageHandler
   * @param {CheckoutHandler} checkoutHandler
   * @param {CartHandler} cartHandler
   */
  constructor(
    protected productHandler: ProductHandler,
    protected categoryHandler: CategoryHandler,
    protected slideHandler: SlideHandler,
    protected configHandler: ConfigHandler,
    protected pageHandler: PageHandler,
    protected checkoutHandler: CheckoutHandler,
    protected cartHandler: CartHandler
  ) {
    super();

    this.addService(ProductServiceRoutes.service, {
      getPopularProducts: this.getPopularProducts,
      getCategoryProducts: this.getCategoryProducts,
      getProduct: this.getProduct,
    });

    this.addService(LanguageServiceRoutes.service, {
      getLanguage: this.getLanguage,
    });

    this.addService(CategoryServiceRoutes.service, {
      getMenu: this.getMenu,
      getHomePageCategories: this.getHomePageCategories,
      getCategory: this.getCategory,
    });

    this.addService(SliderServiceRoutes.service, {
      getHeroSlides: this.getHeroSlides,
      getPromoBanner: this.getPromoBanner,
    });

    this.addService(ConfigServiceRoutes.service, {
      getConfig: this.getConfig,
    });

    this.addService(PageServiceRoutes.service, {
      getPage: this.getPage,
    });
    this.addService(CheckoutServiceRoutes.service, {
      getClientCart: this.getClientCart,
      getClientCheckout: this.getClientCheckout,
    });
  }

  /**
   * Store config request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {config: Settings})} callback Response callback
   */
  protected getConfig = async (
    call: grpc.ServerUnaryCall<ConfigRequest, ConfigResponse>,
    callback: grpc.sendUnaryData<{ config: Settings | null }>
  ) => {
    const {
      error,
      response: { config },
    } = await this.configHandler.getStoreConfig(call);
    callback(error, { config });
  };

  /**
   * Store Language request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {config: Settings})} callback Response callback
   */
  protected getLanguage = async (
    call: grpc.ServerUnaryCall<LanguageRequest, LanguageResponse>,
    callback: grpc.sendUnaryData<{ language: Language | null }>
  ) => {
    const {
      error,
      response: { language },
    } = await this.configHandler.getStoreLanguage(call);
    callback(error, { language });
  };

  /**
   * Store page request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {page: Page})} callback Response callback
   */
  protected getPage = async (
    call: grpc.ServerUnaryCall<PageRequest, PageResponse>,
    callback: grpc.sendUnaryData<{ page: Page | null }>
  ) => {
    const {
      error,
      response: { page },
    } = await this.pageHandler.getStorePage(call);
    callback(error, { page });
  };

  /**
   * Store product request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {products: Product[]})} callback Response callback
   */
  protected getPopularProducts = async (
    call: grpc.ServerUnaryCall<PopularProductsRequest, ProductsResponse>,
    callback: grpc.sendUnaryData<{ products: Product[] | null }>
  ) => {
    const {
      error,
      response: { products },
    } = await this.productHandler.getPopularProducts(call);
    callback(error, { products });
  };

  /**
   * Store category products request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {products: Product[]})} callback Response callback
   */
  protected getCategoryProducts = async (
    call: grpc.ServerUnaryCall<CategoryProductsRequest, ProductsResponse>,
    callback: grpc.sendUnaryData<{ products: Product[] | null }>
  ) => {
    const {
      error,
      response: { products },
    } = await this.productHandler.getCategoryProducts(call);
    callback(error, { products });
  };

  /**
   * Store product request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {products: Product__Output})} callback Response callback
   */
  protected getProduct = async (
    call: grpc.ServerUnaryCall<ProductRequest, ProductResponse>,
    callback: grpc.sendUnaryData<{
      product: Product | ProductType | null;
    }>
  ) => {
    const {
      error,
      response: { product },
    } = await this.productHandler.getProduct(call);
    callback(error, { product });
  };

  /**
   * Store menu request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {menu: Menu__Output[]})} callback Response callback
   */
  protected getMenu = async (
    call: grpc.ServerUnaryCall<MenuRequest__Output, MenuResponse>,
    callback: grpc.sendUnaryData<{ menu: Menu__Output[] }>
  ) => {
    const {
      error,
      response: { menu },
    } = await this.categoryHandler.getMenu(call);
    callback(error, { menu });
  };

  /**
   * Store menu request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {menu: Menu__Output[]})} callback Response callback
   */
  protected getHomePageCategories = async (
    call: grpc.ServerUnaryCall<
      HomePageCategoryRequest__Output,
      HomePageCategoryResponse__Output
    >,
    callback: grpc.sendUnaryData<{ categories: Category__Output[] }>
  ) => {
    const {
      error,
      response: { categories },
    } = await this.categoryHandler.getHomePageCategories(call);
    callback(error, { categories });
  };

  /**
   * Store category request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {category: Category})} callback Response callback
   */
  protected getCategory = async (
    call: grpc.ServerUnaryCall<CategoryRequest, CategoryResponse>,
    callback: grpc.sendUnaryData<{ category: Category | null }>
  ) => {
    const {
      error,
      response: { category },
    } = await this.categoryHandler.getStoreCategory(call);
    callback(error, { category });
  };

  /**
   * Store hero slider request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {sliders: HeroBanner[]})} callback Response callback
   */
  protected getHeroSlides = async (
    call: grpc.ServerUnaryCall<HeroSlidesRequest, HeroSlidesResponse>,
    callback: grpc.sendUnaryData<{ sliders: HeroSlide[] | null }>
  ) => {
    const {
      error,
      response: { sliders },
    } = await this.slideHandler.getHeroSlides(call);
    callback(error, { sliders });
  };

  /**
   * Store Promo slider request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {banner: PromoBanner})} callback Response callback
   */
  protected getPromoBanner = async (
    call: grpc.ServerUnaryCall<PromoBannerRequest, PromoBannerResponse>,
    callback: grpc.sendUnaryData<{ banner: PromoBanner | null }>
  ) => {
    const {
      error,
      response: { banner },
    } = await this.slideHandler.getPromoSlider(call);
    callback(error, { banner });
  };

  /**
   * Cart request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {banner: PromoBanner})} callback Response callback
   */
  protected getClientCart = async (
    call: grpc.ServerUnaryCall<CheckoutRequest, CheckoutResponse>,
    callback: grpc.sendUnaryData<{ cart: Cart | null }>
  ) => {
    const {
      error,
      response: { cart },
    } = await this.cartHandler.getCart(call);
    callback(error, { cart });
  };

  /**
   * Checkout request handler.
   * @param {EventEmitter} call Call object for the handler to process
   * @param {function(Error, {banner: PromoBanner})} callback Response callback
   */
  protected getClientCheckout = async (
    call: grpc.ServerUnaryCall<CheckoutRequest, CheckoutRequest>,
    callback: grpc.sendUnaryData<{ checkout: Checkout | null }>
  ) => {
    const {
      error,
      response: { checkout },
    } = await this.checkoutHandler.getCheckout(call);
    callback(error, { checkout });
  };
}

export default Container.get(gRPC);
