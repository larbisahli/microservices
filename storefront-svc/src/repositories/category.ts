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

@Service()
export default class CategoryHandler extends PostgresClient {
  /**
   * @param {CategoryQueries} categoryQueries
   */
  constructor(protected categoryQueries: CategoryQueries) {
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
    menu: Menu__Output[];
  }> => {
    const { getMenu } = this.categoryQueries;
    const { alias } = call.request;

    const client = await this.transaction({
      actions: [this.ACTION_PRIVILEGES.READ],
    });

    if (!alias) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        menu: [],
      };
    }

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          menu: [],
        };
      }
      const { rows } = await client.query<Menu__Output>(getMenu());

      await client.query('COMMIT');

      return { menu: rows, error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        menu: [],
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
    category: Category | null;
  }> => {
    const {
      getStoreCategory,
      getStoreCategorySeo,
      getCategoryLevelById,
      getCategoryUrlKeyById,
    } = this.categoryQueries;

    const { alias, urlKey } = call.request;

    console.log({ alias, urlKey });

    const client = await this.transaction({
      actions: [this.ACTION_PRIVILEGES.READ],
    });

    if (!alias || !urlKey) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        category: null,
      };
    }

    try {
      await client.query('BEGIN');

      const { error } = await this.setupClientSessions(client, { alias });

      if (error) {
        return {
          error: {
            code: Status.NOT_FOUND,
            details: error?.message,
          },
          category: null,
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

      await client.query('COMMIT');

      return {
        category: {
          ...category,
          categorySeo: {
            ...categorySeo,
            breadcrumbs,
          },
        },
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
        category: null,
      };
    } finally {
      client.release();
    }
  };
}
