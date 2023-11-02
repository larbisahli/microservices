import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { PageQueries } from '@sql';
import { StorePageRequest } from '@proto/generated/PagePackage/StorePageRequest';
import { StorePageResponse } from '@proto/generated/PagePackage/StorePageResponse';
import { Page } from '@proto/generated/PagePackage/Page';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Service()
export default class PageHandler extends PostgresClient {
  /**
   * @param {PageQueries} pageQueries
   */
  constructor(protected pageQueries: PageQueries) {
    super();
  }

  /**
   * @param { ServerUnaryCall<StorePageRequest, StorePageResponse>} call
   * @returns {Promise<Page>}
   */
  public getStorePage = async (
    call: ServerUnaryCall<StorePageRequest, StorePageResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    page: Page | null;
  }> => {
    const { getStorePage } = this.pageQueries;
    const { alias, slug } = call.request;

    const client = await this.transaction({
      actions: [this.ACTION_PRIVILEGES.READ],
    });

    if (!alias || !slug) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier or slug are not defined',
        },
        page: null,
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
          page: null,
        };
      }
      const { rows } = await client.query<Page>(getStorePage(slug));

      await client.query('COMMIT');

      return { page: rows[0], error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        page: null,
      };
    } finally {
      client.release();
    }
  };
}
