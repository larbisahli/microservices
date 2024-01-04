import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { CategoryQueries } from '@sql';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { MenuRequest__Output } from '@proto/generated/category/MenuRequest';
import { MenuResponse } from '@proto/generated/category/MenuResponse';
import { Menu__Output } from '@proto/generated/category/Menu';
import { CategoryResponse } from '@proto/generated/category/CategoryResponse';
import { CategoryRequest } from '@proto/generated/category/CategoryRequest';
import { Category, Category__Output } from '@proto/generated/category/Category';
import { Breadcrumbs } from '@proto/generated/category/Breadcrumbs';
import { HomePageCategoryResponse__Output } from '@proto/generated/category/HomePageCategoryResponse';
import { HomePageCategoryRequest__Output } from '@proto/generated/category/HomePageCategoryRequest';
import { ResourceNamesEnum } from '@ts-types/index';
import { CategoryCacheStore } from '@cache/category.store';

@Service()
export default class CategoryHandler extends PostgresClient {
  /**
   * @param {CategoryQueries} categoryQueries
   * @param {CategoryCacheStore} categoryCacheStore
   */
  constructor(
    protected categoryQueries: CategoryQueries,
    protected categoryCacheStore: CategoryCacheStore
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

    /** Check if resource is in the cache store */
    const resource = (await this.categoryCacheStore.getResource({
      alias,
      packageName: ResourceNamesEnum.MENU,
      key: ResourceNamesEnum.MENU,
    })) as { menu: Menu__Output[] | [] };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          response: { menu: [] },
        };
      }

      const { rows } = await client.query<Menu__Output>(
        getMenu(storeLanguageId)
      );

      const menu = rows;

      /** Set the resources in the cache store */
      if (menu && alias) {
        this.categoryCacheStore.setResource({
          store,
          packageName: ResourceNamesEnum.MENU,
          key: ResourceNamesEnum.MENU,
          resource: menu,
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
   * @param { ServerUnaryCall<MenuRequest__Output, MenuResponse>} call
   * @returns {Promise<Menu__Output[]>}
   */
  public getHomePageCategories = async (
    call: ServerUnaryCall<
      HomePageCategoryRequest__Output,
      HomePageCategoryResponse__Output
    >
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { categories: Category__Output[] | [] };
  }> => {
    const { getHomePageCategories } = this.categoryQueries;
    const { alias, storeLanguageId, storeId } = call.request;

    if (!alias || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { categories: [] },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.categoryCacheStore.getResource({
      alias,
      packageName: ResourceNamesEnum.HOMEPAGE_CATEGORIES,
      key: ResourceNamesEnum.HOMEPAGE_CATEGORIES,
    })) as { categories: Category__Output[] | [] };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          response: { categories: [] },
        };
      }

      const { rows } = await client.query<Category__Output>(
        getHomePageCategories(storeLanguageId)
      );

      const categories = rows;

      /** Set the resources in the cache store */
      if (categories && alias) {
        this.categoryCacheStore.setResource({
          store,
          packageName: ResourceNamesEnum.HOMEPAGE_CATEGORIES,
          key: ResourceNamesEnum.HOMEPAGE_CATEGORIES,
          resource: categories,
        });
      }

      await client.query('COMMIT');

      return { response: { categories }, error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { categories: [] },
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
      getCategoryLevelById,
      getCategoryUrlKeyById,
      getStoreCategoryTranslation,
    } = this.categoryQueries;

    const { urlKey, alias, storeLanguageId, storeId } = call.request;

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
    const resource = (await this.categoryCacheStore.getResource({
      alias,
      packageName: ResourceNamesEnum.CATEGORY,
      key: urlKey,
    })) as { category: Category | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, { alias, storeId });

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          response: { category: null },
        };
      }

      let breadcrumbs = [] as Breadcrumbs[];

      const { rows } = await client.query<Category>(
        getStoreCategory(urlKey, storeLanguageId)
      );

      const category = rows[0] ?? {};

      if (!category?.id) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: 'Unknown error',
          },
          response: { category: null },
        };
      }

      const { rows: categoryTranslationRows } = await client.query<Category>(
        getStoreCategoryTranslation(category?.id!, storeLanguageId)
      );

      const categoryTranslation = categoryTranslationRows[0] ?? {};

      // TODO: For breadcrumbs data make sure we are using index only scan in our queries
      // *** Current ***
      breadcrumbs.push({
        // @ts-ignore
        categoryLevel: category?.level,
        categoryName: categoryTranslation?.name,
        categoryUrl: category?.urlKey,
      });

      // *** Parent ***
      if (category?.parentId) {
        const { rows: categoryParentRows } = await client.query<Category>(
          getCategoryLevelById(category?.parentId, storeLanguageId)
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
            getCategoryLevelById(categoryParent?.parentId, storeLanguageId)
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
        ...categoryTranslation,
        breadcrumbs,
      };

      /** Set the resources in the cache store */
      if (category && alias && urlKey) {
        this.categoryCacheStore.setResource({
          store,
          packageName: ResourceNamesEnum.CATEGORY,
          key: urlKey,
          resource: responseCategory,
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
