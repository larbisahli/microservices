import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { PageQueries } from '@sql';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { PageRequest } from '@proto/generated/page/PageRequest';
import { PageResponse } from '@proto/generated/page/PageResponse';
import { Page } from '@proto/generated/page/Page';
import { isEmpty } from 'underscore';
import { PageCacheStore } from '@cache/page.store';
import { CryptoUtils } from '@core';

@Service()
export default class PageHandler extends PostgresClient {
  /**
   * @param {PageQueries} pageQueries
   * @param {PageCacheStore} pageCacheStore
   */
  constructor(
    protected pageQueries: PageQueries,
    protected pageCacheStore: PageCacheStore,
    protected cryptoUtils: CryptoUtils
  ) {
    super();
  }

  /**
   * @param { ServerUnaryCall<PageRequest, PageResponse>} call
   * @returns {Promise<Page>}
   */
  public getStorePage = async (
    call: ServerUnaryCall<PageRequest, PageResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { page: Page | null };
  }> => {
    const { getPage, getPageTranslation } = this.pageQueries;
    const { alias, slug, suid, storeLanguageId } = call.request;

    if (!alias || !slug || !storeLanguageId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier or slug are not defined',
        },
        response: { page: null },
      };
    }

    let storeId: string | null;
    if (suid) {
      storeId = await this.cryptoUtils.decrypt(suid);
    } else {
      storeId = await this.getStoreId({ alias });
    }

    if (!storeId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'store identifier is not defined',
        },
        response: { page: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.pageCacheStore.getPage({
      storeId,
      key: slug,
    })) as { page: Page | null };

    if (resource) {
      return { error: null, response: resource };
    }

    const client = await this.transaction();

    try {
      await client.query('BEGIN');

      const store = await this.setupStoreSessions(client, storeId);

      if (store?.error) {
        return {
          error: {
            code: Status.FAILED_PRECONDITION,
            details: store?.error.message,
          },
          response: { page: null },
        };
      }

      const { rows: pageRows } = await client.query<Page>(getPage(slug));

      const page = pageRows[0];

      if (isEmpty(page)) {
        return {
          error: {
            code: Status.CANCELLED,
            details: 'Page not published',
          },
          response: { page: null },
        };
      }

      const { rows: pageTranslationRows } = await client.query<Page>(
        getPageTranslation(page?.id!, storeLanguageId)
      );

      const translation = pageTranslationRows[0];

      /** Set the resources in the cache store */
      if (page && storeId) {
        this.pageCacheStore.setPage({
          storeId,
          key: slug,
          resource: page,
        });
      }

      await client.query('COMMIT');

      return {
        response: {
          page: {
            ...page,
            ...translation,
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
        response: { page: null },
      };
    } finally {
      client.release();
    }
  };
}
