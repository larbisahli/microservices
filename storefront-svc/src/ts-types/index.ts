import { ACTION_PRIVILEGES, CookieNames, RESOURCES } from './enums';

export interface ErrorHandler extends Error {
  code?: string;
}

export type CookieNamesTypes =
  | typeof CookieNames.CUSTOMER_SESSION_NAME
  | typeof CookieNames.XSRF_TOKEN
  | typeof CookieNames.USER_TOKEN_NAME;

export type CrudPrivileges = {
  [ACTION_PRIVILEGES.READ]: boolean;
  [ACTION_PRIVILEGES.WRITE]: boolean;
  [ACTION_PRIVILEGES.UPDATE]: boolean;
  [ACTION_PRIVILEGES.DELETE]: boolean;
};

export type PrivilegesType = {
  resources: {
    [key: string]: {
      permissions: CrudPrivileges;
    };
  };
};

export type PermissionType = {
  actions: ACTION_PRIVILEGES[];
  resources: RESOURCES[];
};

export interface QueryPermissionType {
  permission: PermissionType;
}

export enum ResourceNamesEnum {
  CONFIG = 'Config',
  LANGUAGE = 'Language',
  MENU = 'Menu',
  CATEGORY = 'Category',
  HOMEPAGE_CATEGORIES = 'HomepageCategories',
  HERO_SLIDE = 'HeroSlide',
  PROMO_SLIDE = 'PromoSlide',
  PRODUCTS = 'Products',
  PRODUCT = 'Product',
  PAGE = 'Page',
}

export type ResourceNamesType = ResourceNamesEnum;
