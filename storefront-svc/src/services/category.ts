import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { CategoryQueries } from '@sql';
import { MenuRequest } from '@proto/generated/categoryPackage/MenuRequest';
import { MenuResponse } from '@proto/generated/categoryPackage/MenuResponse';
import { Menu__Output } from '@proto/generated/categoryPackage/Menu';
import { CategoryRequest } from '@proto/generated/categoryPackage/CategoryRequest';
import { CategoryResponse } from '@proto/generated/categoryPackage/CategoryResponse';
import { Category } from '@proto/generated/categoryPackage/Category';
import { CategorySeo } from '@proto/generated/categoryPackage/CategorySeo';
import { Breadcrumbs } from '@proto/generated/categoryPackage/Breadcrumbs';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ResourceHandler } from '@cache/resource.store';

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
   * @param { ServerUnaryCall<MenuRequest, MenuResponse>} call
   * @returns {Promise<Menu__Output[]>}
   */
  public getMenu = async (
    call: ServerUnaryCall<MenuRequest, MenuResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { menu: Menu__Output[] | [] };
  }> => {
    const { getMenu } = this.categoryQueries;
    const { alias } = call.request;

    console.log('============>', { alias });

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { menu: [] },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.resourceHandler.getResource({
      alias,
      resourceName: 'menu',
      packageName: 'menu',
    })) as { menu: Menu__Output[] | [] };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction(alias);

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          response: { menu: [] },
        };
      }
      const { rows } = await client.query<Menu__Output>(getMenu());

      const menu = rows;

      /** Set the resources in the cache store */
      if (menu && alias) {
        this.resourceHandler.setResource({
          alias,
          resourceName: 'menu',
          resource: menu,
          packageName: 'menu',
        });
      }

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

    const { alias, urlKey } = call.request;

    if (!alias || !urlKey) {
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

    const client = await this.transaction(alias);

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          response: { category: null },
        };
      }

      let breadcrumbs = [] as Breadcrumbs[];

      interface CategorySeoOutput extends CategorySeo {
        categoryId: number;
      }

      const { rows: categorySeoRows } = await client.query<CategorySeoOutput>(
        getStoreCategorySeo(urlKey)
      );

      const categorySeo = categorySeoRows[0] ?? {};

      const { rows: categoryRows } = await client.query<Category>(
        getStoreCategory(categorySeo?.categoryId)
      );

      const category = categoryRows[0] ?? {};

      // TODO: For breadcrumbs data make sure we are using index only scan in our queries

      // *** Current ***
      breadcrumbs.push({
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

        const { rows: categoryParentSeoRows } = await client.query<CategorySeo>(
          getCategoryUrlKeyById(categoryParent?.id!)
        );

        const categoryParentSeo = categoryParentSeoRows[0] ?? {};

        breadcrumbs.push({
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
            await client.query<CategorySeo>(
              getCategoryUrlKeyById(categoryAncestors?.id!)
            );

          const categoryAncestorsSeo = categoryAncestorsSeoRows[0] ?? {};

          breadcrumbs.push({
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
