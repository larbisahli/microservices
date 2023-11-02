import { ServerErrorResponse, StatusObject } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { Service } from 'typedi';
import { PageRpcService } from '@gRPC/client/services';
import { ResourceHandler } from '@cache/resource.store';
import { StorePageRequest } from '@proto/generated/PagePackage/StorePageRequest';
import { StorePageResponse } from '@proto/generated/PagePackage/StorePageResponse';
import { Page } from '@proto/generated/PagePackage/Page';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class PageHandler {
  /**
   * @param {PageRpcService} pageRpcService
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected pageRpcService: PageRpcService,
    protected resourceHandler: ResourceHandler
  ) {}

  /**
   * @param { ServerUnaryCall<StorePageRequest, StorePageResponse>} call
   * @returns {Promise<Page>}
   */
  public getPage = async (
    call: grpc.ServerUnaryCall<StorePageRequest, StorePageResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { page: Page | null | undefined };
  }> => {
    const { alias, slug } = call.request;

    if (!alias || !slug) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Unknown error',
        },
        response: { page: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: slug,
      packageName: 'page',
    })) as { page: Page | null };

    if (resource) {
      return { error: null, response: resource };
    }

    /** Remote procedure call to get menu from the business server */
    const response = await this.pageRpcService.getPage(alias, slug);
    const { page, error } = response;

    /** Set the resources in the cache store */
    if (page && alias) {
      this.resourceHandler.setResource({
        alias,
        resourceName: slug,
        packageName: 'page',
        resource: page,
      });
    }

    return { error, response: { page } };
  };
}
