import { GraphQlErrorCodeType, GraphQlErrorCode } from '@ts-types/enums';
import { HttpStatusCode } from 'axios';
import { GraphQLError } from 'graphql';
import { PRODUCTION_ENV } from '@config';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: PRODUCTION_ENV ? process.env.SENTRY_DSN : '',
  environment: 'production',
  tracesSampleRate: 1.0,
});

export interface Info {
  [attributeName: string]: unknown;
  logger?: {
    ignore: boolean;
    level: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
  };
  http?: {
    status: HttpStatusCode;
  };
}

export interface ExtendedGraphQlError extends GraphQLError {
  extensions: Info;
}

export class ApiError extends GraphQLError implements ExtendedGraphQlError {
  constructor(message: string, code: GraphQlErrorCodeType, info: Info) {
    super(message, null, null, null, null, null, {
      code,
      ...(info ?? {}),
      prototype: new.target.prototype,
    });
    this.sentry(info, message);
  }

  protected sentry(info: Info, message: string) {
    if (info.logger?.ignore) {
      return;
    }
    Sentry.captureException(new Error(message));
  }
}

export class DatabaseError
  extends GraphQLError
  implements ExtendedGraphQlError
{
  constructor(message: string, code: GraphQlErrorCodeType, info: Info) {
    super(message, null, null, null, null, null, {
      code,
      ...(info ?? {}),
      prototype: new.target.prototype,
    });
    this.sentry(info, message);
  }

  protected sentry(info: Info, message: string) {
    if (info.logger?.ignore) {
      return;
    }
    Sentry.captureException(new Error(message));
  }
}

// ************ CUSTOM API ERRORS ************

export class AuthFailureError extends ApiError {
  constructor(message = 'Invalid Credentials', info?: Info) {
    super(message, GraphQlErrorCode.UNAUTHORIZED, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 401 },
      ...(info ?? {}),
    });
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal error', info?: Info) {
    super(message, GraphQlErrorCode.INTERNAL_ERROR, {
      logger: {
        ignore: false,
        level: 'error',
      },
      http: { status: 500 },
      ...(info ?? {}),
    });
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', info?: Info) {
    super(message, GraphQlErrorCode.BAD_REQUEST, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 400 },
      ...(info ?? {}),
    });
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found', info?: Info) {
    super(message, GraphQlErrorCode.NOT_FOUND, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 404 },
      ...(info ?? {}),
    });
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Permission denied', info?: Info) {
    super(message, GraphQlErrorCode.FORBIDDEN, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 403 },
      ...(info ?? {}),
    });
  }
}

export class BadTokenError extends ApiError {
  constructor(message = 'Token is not valid', info?: Info) {
    super(message, GraphQlErrorCode.BAD_TOKEN, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 401 },
      ...(info ?? {}),
    });
  }
}

export class InvalidCsrfTokenError extends ApiError {
  constructor(message = 'Invalid csrf token', info?: Info) {
    super(message, GraphQlErrorCode.BAD_CSRF_TOKEN, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 401 },
      ...(info ?? {}),
    });
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = 'Token is expired', info?: Info) {
    super(message, GraphQlErrorCode.TOKEN_EXPIRED, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 401 },
      ...(info ?? {}),
    });
  }
}

export class ReCaptchaTokenError extends ApiError {
  constructor(message = 'Invalid token', info?: Info) {
    super(message, GraphQlErrorCode.TOKEN_EXPIRED, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 401 },
      ...(info ?? {}),
    });
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = 'Invalid access token', info?: Info) {
    super(message, GraphQlErrorCode.ACCESS_TOKEN, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 401 },
      ...(info ?? {}),
    });
  }
}

// ************ CUSTOM DATABASE ERRORS ************

export class DuplicateKeyError extends DatabaseError {
  constructor(message = 'Value already exits', info?: Info) {
    super(message, GraphQlErrorCode.DUPLICATE_KEY, {
      logger: {
        ignore: true,
        level: 'warn',
      },
      http: { status: 409 },
      ...(info ?? {}),
    });
  }
}

export class TransactionError extends DatabaseError {
  constructor(message = 'Transaction error', info?: Info) {
    super(message, GraphQlErrorCode.TRANSACTION, {
      logger: {
        ignore: false,
        level: 'error',
      },
      http: { status: 500 },
      ...(info ?? {}),
    });
  }
}
