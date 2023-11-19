/**
 * Dropgala - Storefront gRPC Server
 *
 * Copyright © Dropgala, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license - my license :)
 * @link https://github.com/dropgala/business-server
 * @author Larbi Sahli <larbisahli1905@gmail.com>
 */
import 'reflect-metadata';
import 'module-alias/register';

import dotenv from 'dotenv';
dotenv.config();

import { Logger } from '@core';
import gRPC, { createInsecure } from '@services';
import { RPCPort } from './config';

/**
 * Starts an Business RPC server that receives requests for the storefrontServerService service
 */
(async function () {
  gRPC.bindAsync(RPCPort, createInsecure(), (error) => {
    gRPC.start();
    if (error) {
      console.error(error);
      Logger.system.error(error);
    } else {
      Logger.system.info(
        `🚀 Storefront RPC server running on port : ${RPCPort}`
      );
    }
  });
})();
