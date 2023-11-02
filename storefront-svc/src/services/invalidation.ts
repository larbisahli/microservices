import { ServerErrorResponse, StatusObject } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { Service } from 'typedi';
import { ResourceHandler } from '@cache/resource.store';
import {
  InvalidateResourceResponse,
  InvalidateResourceResponse__Output,
} from '@proto/generated/ServiceRoutes/InvalidateResourceResponse';
import { InvalidateResourceRequest } from '@proto/generated/ServiceRoutes/InvalidateResourceRequest';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class InvalidationHandler {
  /**
   * @param {ResourceHandler} resourceHandler
   */
  constructor(protected resourceHandler: ResourceHandler) {}

  /**
   * @param { ServerUnaryCall<InvalidateResourceRequest, InvalidateResourceResponse>} call
   * @returns {Promise<InvalidateResourceResponse__Output>}
   */
  public invalidateCache = async (
    call: grpc.ServerUnaryCall<
      InvalidateResourceRequest,
      InvalidateResourceResponse
    >
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: InvalidateResourceResponse__Output;
  }> => {
    const { alias, resourceName, packageName } = call.request;

    if (!alias || !resourceName || !packageName) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Unknown error',
        },
        response: { success: false },
      };
    }

    const success = await this.resourceHandler.deleteResource({
      alias,
      resourceName,
      packageName,
    });

    return { error: null, response: { success: !!success } };
  };
}
