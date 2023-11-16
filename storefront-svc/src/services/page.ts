import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { ResourceHandler } from '@cache/resource.store';
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
   * @param {ResourceHandler} resourceHandler
   */
  constructor(
    protected pageQueries: PageQueries,
    protected resourceHandler: ResourceHandler
  ) {
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
    response: { page: Page | null };
  }> => {
    const { getStorePage } = this.pageQueries;
    const { alias, slug } = call.request;

    if (!alias || !slug) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier or slug are not defined',
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
          response: { page: null },
        };
      }
      const { rows } = await client.query<Page>(getStorePage(slug));

      const page = rows[0];

      /** Set the resources in the cache store */
      if (page && alias) {
        this.resourceHandler.setResource({
          alias,
          resourceName: slug,
          packageName: 'page',
          resource: page,
        });
      }

      await client.query('COMMIT');

      return { response: { page }, error: null };
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
