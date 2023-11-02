import { ServerErrorResponse, StatusObject } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { Service } from 'typedi';
import { ConfigRpcService } from '@gRPC/client/services';
import { ResourceHandler } from '@cache/resource.store';
import { StoreConfigRequest } from '@proto/generated/SettingsPackage/StoreConfigRequest';
import { StoreConfigResponse } from '@proto/generated/SettingsPackage/StoreConfigResponse';
import { Settings__Output } from '@proto/generated/SettingsPackage/Settings';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class ConfigHandler {
  /**
   * @param {ConfigRpcService} configRpcService
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected configRpcService: ConfigRpcService,
    protected resourceHandler: ResourceHandler
  ) {}

  /**
   * @param { ServerUnaryCall<StoreConfigRequest, StoreConfigResponse>} call
   * @returns {Promise<Settings__Output>}
   */
  public getStoreConfig = async (
    call: grpc.ServerUnaryCall<StoreConfigRequest, StoreConfigResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { config: Settings__Output | null | undefined };
  }> => {
    const { alias } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Unknown error',
        },
        response: { config: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: 'storeConfig',
      packageName: 'storeConfig',
    })) as { config: Settings__Output | null | undefined };

    if (resource) {
      return { error: null, response: resource };
    }

    /** Remote procedure call to get menu from the business server */
    const response = await this.configRpcService.getConfig(alias);
    const { config, error } = response;

    /** Set the resources in the cache store */
    if (config && alias) {
      this.resourceHandler.setResource({
        alias,
        resourceName: 'storeConfig',
        packageName: 'storeConfig',
        resource: config,
      });
    }

    return { error, response: { config } };
  };
}
