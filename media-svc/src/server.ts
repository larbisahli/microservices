/**
 * Dropgala - Media Server
 *
 * Copyright © Dropgala, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license - my license :)
 * @link https://github.com/dropgala/business-server
 * @author Larbi Sahli <larbi.sahli@dropgala.com|larbisahli1905@gmail.com>
 */

import 'reflect-metadata';
import 'module-alias/register';
import helmet from 'helmet';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import mountRoutes from '@routes/index';
import {
  PRODUCTION_ENV,
} from './config';
import '@core/Queue';
//@ts-ignore

// import { applyMiddleware } from 'graphql-middleware';

dotenv.config();

const app: Application = express();

app.set('trust proxy', true);

// Middlewares
//  Size of payload
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ limit: '16mb', extended: true }));
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'dropgala');
  next();
});
app.use(
  helmet({
    contentSecurityPolicy: PRODUCTION_ENV ? undefined : false,
  })
);

mountRoutes(app);

/**
 * Attach the fallback Middleware function
 * which sends back the response for invalid paths
*/
app.use((req, res, next) => {
  res.status(404);
  res.send('Unknown error!');
});