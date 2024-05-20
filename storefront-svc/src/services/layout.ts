import PostgresClient from '@database';
import {
  ServerErrorResponse,
  ServerUnaryCall,
  StatusObject,
} from '@grpc/grpc-js';
import { Service } from 'typedi';
import { LayoutQueryString } from '@sql';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { CryptoUtils } from '@core';
import { LayoutCacheStore } from '@cache/layout.store';
import {
  StoreLayoutComponentContentType,
  StoreLayoutComponentType,
  StoreLayoutType,
} from '@ts-types/interfaces';
import { PageLayoutBlocks } from '@ts-types/enums';
import { groupBy } from 'underscore';
import { Layout } from '@proto/generated/layout/Layout';
import { LayoutRequest } from '@proto/generated/layout/LayoutRequest';
import { LayoutResponse } from '@proto/generated/layout/LayoutResponse';
import { PoolClient } from 'pg';

@Service()
export default class LayoutHandler extends PostgresClient {
  /**
   * @param {LayoutQueryString} layoutQueryString
   * @param {CmsCacheStore} cmsCacheStore
   */
  constructor(
    protected layoutQueryString: LayoutQueryString,
    protected layoutCacheStore: LayoutCacheStore,
    protected cryptoUtils: CryptoUtils
  ) {
    super();
  }

  /**
   * @param {any} call
   * @returns {Promise<{ layout: StoreLayoutComponentType[] }>}
   */
  public getPageCommonLayout = async ({
    client,
    storeLanguageId,
    templateId,
    store,
  }: {
    client: PoolClient;
    storeLanguageId: number;
    templateId: string;
    store: { storeId: string };
  }): Promise<{ [PageLayoutBlocks.Main]: StoreLayoutComponentType[] }> => {
    const { storeId } = store;
    /** Check if resource is in the cache store */

    const resource = (await this.layoutCacheStore.getPageLayout(
      storeId,
      templateId,
      storeLanguageId,
      null,
      true
    )) as { layout: { [PageLayoutBlocks.Main]: StoreLayoutComponentType[] } };

    if (resource) {
      return resource.layout;
    }

    try {
      // ** ***** JSS-COMMON *****
      const { rows: commonLayoutRows } = await client.query<StoreLayoutType>(
        this.layoutQueryString.getCommonLayout(templateId)
      );

      const { id: commonLayoutId } = commonLayoutRows[0];

      const { rows: commonLayoutComponents } =
        await client.query<StoreLayoutComponentType>(
          this.layoutQueryString.getLayoutComponents(commonLayoutId, true)
        );

      console.log({ commonLayoutComponents });

      let components: StoreLayoutComponentType[] = [];

      for await (const component of commonLayoutComponents) {
        const { componentId, moduleName, parentId, position, moduleGroup } =
          component;

        const { rows: mainLayoutComponentContent } =
          await client.query<StoreLayoutComponentContentType>(
            this.layoutQueryString.getPageLayoutComponentContent(
              componentId!,
              storeLanguageId
            )
          );

        const { id: mainContentId, data } = mainLayoutComponentContent[0] ?? {};

        const MainData = mainContentId
          ? { contentId: mainContentId, ...data }
          : {};

        components.push({
          parentId,
          componentId,
          moduleName,
          position,
          moduleGroup,
          data: Buffer.from(JSON.stringify(MainData), 'utf-8').toString(
            'base64'
          ),
        });
      }

      const grouped = groupBy<StoreLayoutComponentType[]>(
        components,
        (component) => component.parentId
      );

      function childrenOf(
        parentId: string | number
      ): StoreLayoutComponentType[] {
        return (grouped[parentId] || []).map((component) => ({
          ...component,
          children: childrenOf(component.componentId),
        }));
      }

      const commonLayout = childrenOf('null');

      const { rows: languageRows } = await client.query<{ localeId: string }>(
        this.layoutQueryString.getLanguageLocaleId(storeLanguageId)
      );

      const { localeId } = languageRows[0];

      const resource = { [PageLayoutBlocks.Main]: commonLayout };

      /** Set the resources in the cache store */
      if (resource && store.storeId) {
        // this.layoutCacheStore.setPageLayout({
        //   storeId,
        //   templateId,
        //   storeLanguageId,
        //   localeId,
        //   resource,
        //   isCommon: true,
        // });
      }

      return resource;
    } catch (error: any) {
      throw error;
    }
  };

  /**
   * @param { ServerUnaryCall<LayoutRequest, LayoutRequest>} call
   * @returns {Promise<{ layout: Layout }>}
   */
  public getPageLayout = async (
    call: ServerUnaryCall<LayoutRequest, LayoutResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { layout: Layout | null };
  }> => {
    const {
      alias,
      storeLanguageId,
      suid,
      page,
      templateId,
      isCustom = false,
    } = call.request;

    if (!alias || !storeLanguageId || !templateId) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'Store identifier is not defined',
        },
        response: { layout: null },
      };
    }

    if (!page) {
      return {
        error: {
          code: Status.CANCELLED,
          details: 'page value is not defined',
        },
        response: { layout: null },
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
        response: { layout: null },
      };
    }

    /** Check if resource is in the cache store */
    const resource = (await this.layoutCacheStore.getPageLayout(
      storeId,
      templateId,
      storeLanguageId,
      page,
      false
    )) as { layout: Layout | null };

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
          response: { layout: null },
        };
      }

      const { rows: layoutRows } = await client.query<StoreLayoutType>(
        this.layoutQueryString.getPageLayout(templateId, page, isCustom)
      );

      const { id: layoutId, name: layoutName, title } = layoutRows[0];

      let layout = {
        templateId,
        layoutId,
        layoutName,
        title,
      } as { [key: string]: any };

      const getCommonComponents = await this.getPageCommonLayout({
        client,
        storeLanguageId,
        templateId,
        store,
      });

      const commonComponents = getCommonComponents[PageLayoutBlocks.Main];

      // ** ***** JSS-HEADER *****
      layout[PageLayoutBlocks.Header] = commonComponents.find(
        (component) => component.moduleGroup === 'Header'
      );

      //** ***** JSS-FOOTER *****
      layout[PageLayoutBlocks.Footer] = commonComponents.find(
        (component) => component.moduleGroup === 'Footer'
      );

      //** ***** JSS-MAIN *****
      const { rows: mainLayoutComponents } =
        await client.query<StoreLayoutComponentType>(
          this.layoutQueryString.getLayoutComponents(layoutId, false)
        );

      let main: StoreLayoutComponentType[] = [];

      for await (const component of mainLayoutComponents) {
        const { componentId, moduleName, parentId, position, moduleGroup } =
          component;

        const { rows: mainLayoutComponentContent } =
          await client.query<StoreLayoutComponentContentType>(
            this.layoutQueryString.getPageLayoutComponentContent(
              componentId!,
              storeLanguageId
            )
          );

        const { id: mainContentId, data } = mainLayoutComponentContent[0] ?? {};

        const MainData = mainContentId
          ? { contentId: mainContentId, ...data }
          : {};

        main.push({
          parentId,
          componentId,
          moduleName,
          moduleGroup,
          position,
          data: Buffer.from(JSON.stringify(MainData), 'utf-8').toString(
            'base64'
          ),
        });
      }

      const grouped = groupBy<StoreLayoutComponentType[]>(
        main,
        (component) => component.parentId
      );

      function childrenOf(
        parentId: string | number
      ): StoreLayoutComponentType[] {
        return (grouped[parentId] || []).map((component) => ({
          ...component,
          children: childrenOf(component.componentId),
        }));
      }

      const filteredCommonComponents = commonComponents.filter(
        (component) =>
          component.moduleGroup !== 'Header' &&
          component.moduleGroup !== 'Footer'
      );

      layout[PageLayoutBlocks.Main] = [
        ...childrenOf('null'),
        ...filteredCommonComponents,
      ];

      const { rows: languageRows } = await client.query<{ localeId: string }>(
        this.layoutQueryString.getLanguageLocaleId(storeLanguageId)
      );

      const { localeId } = languageRows[0];

      /** Set the resources in the cache store */
      if (layout && storeId) {
        // this.layoutCacheStore.setPageLayout({
        //   storeId,
        //   templateId,
        //   page,
        //   storeLanguageId,
        //   localeId,
        //   resource: layout,
        //   isCommon: false
        // });
      }

      await client.query('COMMIT');

      return { response: { layout }, error: null };
    } catch (error: any) {
      await client.query('ROLLBACK');
      console.log(error);
      const message = error?.message as string;
      return {
        error: {
          code: Status.FAILED_PRECONDITION,
          details: message,
        },
        response: { layout: null },
      };
    } finally {
      client.release();
    }
  };
}
