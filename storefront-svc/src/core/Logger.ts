import { createLogger, transports, format } from 'winston';
// import fs from 'fs';
// import path from 'path';
// import DailyRotateFile from 'winston-daily-rotate-file';
import { MongoDBConfig, PRODUCTION_ENV } from '@config';
import 'winston-mongodb';

// const logDir = path.resolve('log');

// create directory if it is not present
// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir);
// }

const logLevel = !PRODUCTION_ENV ? 'warn' : 'debug'; // TODO Remove ! when done debugging on prod

// const options = {
//   file: {
//     level: logLevel,
//     filename: logDir + '/%DATE%.log',
//     datePattern: 'YYYY-MM-DD',
//     zippedArchive: true,
//     timestamp: true,
//     handleExceptions: true,
//     humanReadableUnhandledException: true,
//     prettyPrint: true,
//     json: true,
//     maxSize: '20m',
//     maxFiles: '30d',
//     colorize: true,
//   },
// };

// add()

const loggerParams = {
  level: process.env.NODE_ENV === 'development' ? 'info' : 'error',
  exitOnError: false, // do not exit on handled exceptions
  transports: [
    new transports.MongoDB({
      db: MongoDBConfig.admin_url,
      level: logLevel,
      storeHost: true,
      metaKey: 'metadata',
      options: { useUnifiedTopology: true, poolSize: 2, useNewUrlParser: true },
    }),
    new transports.Console({
      handleExceptions: false,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(
          (info) =>
            `${info.timestamp} [${format
              .colorize()
              .colorize(info.level, info.level.toUpperCase())}]: ${
              info.group ? `[${info.group}]` : ``
            } ${info.message}`
        )
      ),
    }),
    // new DailyRotateFile(options.file),
  ],
};

const cleverConcatenate = (args: any) =>
  args.reduce((accum: any, current: any) => {
    if (current && current.stack) {
      return process.env.NODE_ENV === 'development'
        ? `${accum}
        ${current.stack}
        `
        : `${accum} ${current.message}`;
    } else if (current === undefined) {
      return `${accum} undefined`;
    } else {
      return `${accum} ${current.toString()}`;
    }
  }, '');

const proxify = (logger: any, group: any) =>
  new Proxy(logger, {
    get(target, propKey: any) {
      if (
        ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'].indexOf(
          propKey
        ) > -1
      ) {
        return (...args: any[]) => {
          if (args.length > 1) {
            args = cleverConcatenate(args);
          }
          return target.log({
            metadata: { group },
            message: args,
            level: propKey,
          });
        };
      } else {
        return target[propKey];
      }
    },
  });

interface loggerMethods {
  error: (error: unknown) => void;
  warn: (error: unknown) => void;
  info: (error: unknown) => void;
  http: (error: unknown) => void;
  verbose: (error: unknown) => void;
  debug: (error: unknown) => void;
  silly: (error: unknown) => void;
}

const logger = createLogger(loggerParams);

// System logger
const system: loggerMethods = proxify(logger, 'system');
// Database logger
const database: loggerMethods = proxify(logger, 'database');
// api logger
const api: loggerMethods = proxify(logger, 'api');

export default { system, database, api };
