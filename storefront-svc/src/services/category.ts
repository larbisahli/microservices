import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { CategoryQueries } from '@sql';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ResourceHandler } from '@cache/resource.store';
import { MenuRequest__Output } from '@proto/generated/category/MenuRequest';
import { MenuResponse } from '@proto/generated/category/MenuResponse';
import { Menu__Output } from '@proto/generated/category/Menu';
import { CategoryResponse } from '@proto/generated/category/CategoryResponse';
import { CategoryRequest } from '@proto/generated/category/CategoryRequest';
import { Category } from '@proto/generated/category/Category';
import { Breadcrumbs } from '@proto/generated/category/Breadcrumbs';
import { isEmpty } from 'underscore';

@Service()
export default class CategoryHandler extends PostgresClient {
  /**
   * @param {CategoryQueries} categoryQueries
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected categoryQueries: CategoryQueries,
    protected resourceHandler: ResourceHandler
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<MenuRequest__Output, MenuResponse>} call
   * @returns {Promise<Menu__Output[]>}
   */
  public getMenu = async (
    call: ServerUnaryCall<MenuRequest__Output, MenuResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { menu: Menu__Output[] | [] };
  }> => {
    const { getMenu } = this.categoryQueries;
    const { alias, storeLanguageId, storeId } = call.request;

    if (!alias || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { menu: [] },
      };
    }

    // /** Check if resource is in the cache store */
    // const resource = (await this.resourceHandler.getResource({
    //   alias,
    //   resourceName: 'menu',
    //   packageName: 'menu',
    // })) as { menu: Menu__Output[] | [] };

    // if (resource) {
    //   return { error: null, response: resource };
    // }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      await this.setupStoreSessions(client, { alias, storeId });

      const { rows } = await client.query<Menu__Output>(
        getMenu(storeLanguageId)
      );

      const menu = rows;

      /** Set the resources in the cache store */
      // if (menu && alias) {
      //   this.resourceHandler.setResource({
      //     alias,
      //     resourceName: 'menu',
      //     resource: menu,
      //     packageName: 'menu',
      //   });
      // }

      await client.query('COMMIT');

      return { response: { menu }, error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { menu: [] },
      };
    } finally {
      client.release();
    }
  };

  /**
   * @param { ServerUnaryCall<CategoryRequest, CategoryResponse>} call
   * @returns {Promise<Category>}
   */
  public getStoreCategory = async (
    call: ServerUnaryCall<CategoryRequest, CategoryResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { category: Category | null };
  }> => {
    const {
      getStoreCategory,
      getStoreCategorySeo,
      getCategoryLevelById,
      getCategoryUrlKeyById,
    } = this.categoryQueries;

    const { alias, storeLanguageId, storeId, urlKey } = call.request;

    if (!alias || !urlKey || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
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

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      await this.setupStoreSessions(client, { alias, storeId });

      let breadcrumbs = [] as Breadcrumbs[];

      const { rows: categorySeoRows } = await client.query<Category>(
        getStoreCategorySeo(urlKey)
      );

      const categorySeo = categorySeoRows[0] ?? {};

      const { rows: categoryRows } = await client.query<Category>(
        // @ts-ignore
        getStoreCategory(categorySeo?.categoryId)
      );

      const category = categoryRows[0] ?? {};

      // TODO: For breadcrumbs data make sure we are using index only scan in our queries

      // *** Current ***
      breadcrumbs.push({
        // @ts-ignore
        categoryLevel: category?.level,
        categoryName: category.name,
        categoryUrl: categorySeo?.urlKey,
      });

      // *** Parent ***
      if (category?.parentId) {
        const { rows: categoryParentRows } = await client.query<Category>(
          getCategoryLevelById(category?.parentId)
        );

        const categoryParent = categoryParentRows[0] ?? {};

        const { rows: categoryParentSeoRows } = await client.query<Category>(
          getCategoryUrlKeyById(categoryParent?.id!)
        );

        const categoryParentSeo = categoryParentSeoRows[0] ?? {};

        breadcrumbs.push({
          // @ts-ignore
          categoryLevel: categoryParent.level,
          categoryName: categoryParent.name,
          categoryUrl: categoryParentSeo?.urlKey,
        });

        // *** Ancestor ***
        if (categoryParent?.parentId) {
          const { rows: categoryAncestorsRows } = await client.query<Category>(
            getCategoryLevelById(categoryParent?.parentId)
          );

          const categoryAncestors = categoryAncestorsRows[0] ?? {};

          const { rows: categoryAncestorsSeoRows } =
            await client.query<Category>(
              getCategoryUrlKeyById(categoryAncestors?.id!)
            );

          const categoryAncestorsSeo = categoryAncestorsSeoRows[0] ?? {};

          breadcrumbs.push({
            // @ts-ignore
            categoryLevel: categoryAncestors.level,
            categoryName: categoryAncestors.name,
            categoryUrl: categoryAncestorsSeo?.urlKey,
          });
        }
      }

      const responseCategory = {
        ...category,
        categorySeo: {
          ...categorySeo,
          breadcrumbs,
        },
      };

      /** Set the resources in the cache store */
      if (category && alias && urlKey) {
        this.resourceHandler.setResource({
          alias,
          resourceName: urlKey,
          resource: responseCategory,
          packageName: 'category',
        });
      }

      await client.query('COMMIT');

      return {
        response: { category: responseCategory },
        error: null,
      };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { category: null },
      };
    } finally {
      client.release();
    }
  };
}
