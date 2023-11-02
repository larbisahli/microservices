import { Request, Response, NextFunction } from 'express';
import { ACTION_PRIVILEGES, CookieNames, RESOURCES } from './enums';
import { StoreType, UserType } from './interfaces';

export interface ErrorHandler extends Error {
  code?: string;
}

export interface GraphRequest extends Request {
  cookies: any;
  user: UserType;
  store: StoreType;
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

export type ExpressMiddleware = (
  req: GraphRequest,
  res: Response,
  next: NextFunction
) => void;

export interface GraphQLContextType {
  req: GraphRequest;
  res?: Response;
  ip?: string;
  info: {
    fieldName: string;
  };
}

export type PermissionType = {
  actions: ACTION_PRIVILEGES[];
  resources: RESOURCES[];
};

export interface QueryPermissionType {
  permission: PermissionType;
}
