export enum ACTION_PRIVILEGES {
  READ = 'read',
  WRITE = 'write',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum AttributeTypes {
  COLOR = 'color',
  TEXT = 'text',
}

export enum RESOURCES {
  USER = 'user',
  CATEGORY = 'category',
  PRODUCT = 'product',
  TAG = 'tag',
  SUPPLIER = 'supplier',
  ATTRIBUTE = 'attribute',
  CUSTOMER = 'customer',
  COUPON = 'coupon',
  SHIPPING = 'shipping', // TODO to shippings
  ORDER_STATUS = 'orderStatus',
  ORDER = 'order',
  ROLE = 'role',
  THEME = 'theme',
  STORE = 'store',
  MARKETPLACE = 'marketPlace',
  STORE_SETTINGS = 'storeSettings',
  PAGES = 'pages',
  MEDIA = 'media',
  MANUFACTURER = 'manufacturer',
  STORE_LANGUAGE = 'storeLanguage',
  INTERNAL = 'internal',
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum OrderBy {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export enum CookieNames {
  USER_TOKEN_NAME = '_uuid',
  CUSTOMER_SESSION_NAME = '_cuid',
  XSRF_TOKEN = 'xsrf-token',
}

enum CustomErrorCode {
  BAD_TOKEN = 'BAD_TOKEN',
  BAD_CSRF_TOKEN = 'BAD_CSRF_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_KEY = 'DUPLICATE_KEY',
  TRANSACTION = 'TRANSACTION',
  USER_ALREADY_EXIST = 'USER_ALREADY_EXIST',
  EMAIL_ALREADY_EXIST = 'EMAIL_ALREADY_EXIST',
  PRODUCT_NAME_ALREADY_EXIST = 'PRODUCT_NAME_ALREADY_EXIST',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SOMETHING_HAPPENED = 'SOMETHING_HAPPENED',
  USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST',
  FORBIDDEN = 'FORBIDDEN',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_NOT_ACTIVE = 'USER_NOT_ACTIVE',
  INVALID_CSRF_TOKEN = 'INVALID_CSRF_TOKEN',
  VALUE_IN_USE = 'VALUE_IN_USE',
  STORE_LINK_IN_USE = 'STORE_LINK_IN_USE',
}

export enum PageLayoutBlocks {
  Header = 'jssHeader',
  Main = 'jssMain',
  Footer = 'jssFooter',
}
