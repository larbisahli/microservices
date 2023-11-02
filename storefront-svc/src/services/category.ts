import { ServerErrorResponse, StatusObject } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { Service } from 'typedi';
import { MenuRequest } from '@proto/generated/categoryPackage/MenuRequest';
import { MenuResponse } from '@proto/generated/categoryPackage/MenuResponse';
import { Menu__Output } from '@proto/generated/categoryPackage/Menu';
import { CategoryRpcService } from '@gRPC/client/services';
import { ResourceHandler } from '@cache/resource.store';
import { CategoryRequest } from '@proto/generated/categoryPackage/CategoryRequest';
import { CategoryResponse } from '@proto/generated/categoryPackage/CategoryResponse';
import { Category } from '@proto/generated/categoryPackage/Category';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class CategoryHandler {
  /**
   * @param {CategoryRpcService} categoryRpcService
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected categoryRpcService: CategoryRpcService,
    protected resourceHandler: ResourceHandler
  ) {}

  /**
   * @param { ServerUnaryCall<MenuRequest, MenuResponse>} call
   * @returns {Promise<Menu__Output[]>}
   */
  public getMenu = async (
    call: grpc.ServerUnaryCall<MenuRequest, MenuResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { menu: Menu__Output[] | null };
  }> => {
    const { alias } = call.request;

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Unknown error',
        },
        response: { menu: [] },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: 'menu',
      packageName: 'menu',
    })) as { menu: Menu__Output[] | null };

    if (resource) {
      return { error: null, response: resource };
    }

    /** Remote procedure call to get menu from the business server */
    const response = await this.categoryRpcService.getMenu(alias);
    const { menu = [], error } = response;

    /** Set the resources in the cache store */
    if (menu && alias) {
      this.resourceHandler.setResource({
        alias,
        resourceName: 'menu',
        resource: menu,
        packageName: 'menu',
      });
    }

    return { error, response: { menu } };
  };

  /**
   * @param { ServerUnaryCall<CategoryRequest, CategoryResponse>} call
   * @returns {Promise<Category>}
   */
  public getStoreCategory = async (
    call: grpc.ServerUnaryCall<CategoryRequest, CategoryResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { category: Category | null };
  }> => {
    const { alias, urlKey } = call.request;

    if (!alias || !urlKey) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Unknown error',
        },
        response: { category: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: urlKey,
      packageName: 'category',
    })) as { category: Category | null };

    if (resource) {
      return { error: null, response: resource };
    }

    /** Remote procedure call to get menu from the business server */
    const response = await this.categoryRpcService.getCategory(alias, urlKey);
    const { category = null, error } = response;

    /** Set the resources in the cache store */
    if (category && alias && urlKey) {
      this.resourceHandler.setResource({
        alias,
        resourceName: urlKey,
        resource: category,
        packageName: 'category',
      });
    }

    return { error, response: { category } };
  };
}
