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
  SettingsType,
  StoreLayoutBlockType,
  StoreLayoutComponentContentType,
  StoreLayoutComponentType,
  StoreLayoutType,
} from '@ts-types/interfaces';
import { PageLayoutBlocks } from '@ts-types/enums';
import { groupBy } from 'underscore';
import { Layout } from '@proto/generated/layout/Layout';
import { LayoutRequest } from '@proto/generated/layout/LayoutRequest';
import { LayoutResponse } from '@proto/generated/layout/LayoutResponse';
import language from '@cache/models/language';

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
   * @param { ServerUnaryCall<LayoutRequest, LayoutRequest>} call
   * @returns {Promise<{ layout: Layout }>}
   */
  public getPageLayout = async (
    call: ServerUnaryCall<LayoutRequest, LayoutResponse>
  ): Promise<{
    error: ServerErrorResponse | Partial<StatusObject> | null;
    response: { layout: Layout | null };
  }> => {
    const { alias, storeLanguageId, suid, page } = call.request;

    console.log({ alias, storeLanguageId, suid, page });

    if (!alias || !storeLanguageId) {
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
      page,
      storeLanguageId
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

      const { rows: settingsRows } = await client.query<SettingsType>(
        this.layoutQueryString.getStoreTemplateId()
      );

      const { templateId } = settingsRows[0];

      if (!templateId) {
        return {
          error: {
            code: Status.CANCELLED,
            details: 'templateId not defined',
          },
          response: { layout: null },
        };
      }

      const { rows: layoutRows } = await client.query<StoreLayoutType>(
        this.layoutQueryString.getPageLayout(templateId, page)
      );

      const { id: layoutId, name: layoutName } = layoutRows[0];

      let layout = {
        templateId,
        layoutId,
        layoutName,
      } as { [key: string]: any };

      // ** ***** JSS-HEADER *****
      const { rows: headerLayoutBlockRows } =
        await client.query<StoreLayoutBlockType>(
          this.layoutQueryString.GetPageLayoutBlocks(
            layoutId,
            PageLayoutBlocks.Header
          )
        );

      const { id: headerLayoutBlockId } = headerLayoutBlockRows[0];

      const { rows: headerLayoutComponents } =
        await client.query<StoreLayoutComponentType>(
          this.layoutQueryString.getPageLayoutComponents(headerLayoutBlockId)
        );

      layout[PageLayoutBlocks.Header] = {
        children: [],
        data: {},
      };

      for await (const component of headerLayoutComponents) {
        const { componentId, moduleName, parentId, position } = component;

        const { rows: headerLayoutComponentContent } =
          await client.query<StoreLayoutComponentContentType>(
            this.layoutQueryString.getPageLayoutComponentContent(
              componentId!,
              storeLanguageId
            )
          );

        const { id: headerContentId, data } =
          headerLayoutComponentContent[0] ?? {};

        let headerData = {};
        if (data) {
          headerData = Buffer.from(
            JSON.stringify(
              headerContentId ? { contentId: headerContentId, ...data } : {}
            ),
            'utf-8'
          ).toString('base64');
        }

        if (!parentId) {
          layout[PageLayoutBlocks.Header] = {
            ...layout[PageLayoutBlocks.Header],
            layoutBlockId: headerLayoutBlockId,
            componentId,
            moduleName,
            position,
            data: headerData,
          };
        } else {
          layout[PageLayoutBlocks.Header].children.push({
            layoutBlockId: headerLayoutBlockId,
            componentId,
            moduleName,
            position,
            data: headerData,
          });
        }
      }

      //** ***** JSS-FOOTER *****
      const { rows: footerLayoutBlockRows } =
        await client.query<StoreLayoutBlockType>(
          this.layoutQueryString.GetPageLayoutBlocks(
            layoutId,
            PageLayoutBlocks.Footer
          )
        );

      const { id: footerLayoutBlockId } = footerLayoutBlockRows[0];

      const { rows: footerLayoutComponents } =
        await client.query<StoreLayoutComponentType>(
          this.layoutQueryString.getPageLayoutComponents(footerLayoutBlockId)
        );

      layout[PageLayoutBlocks.Footer] = {
        children: [],
        data: {},
      };
      for await (const component of footerLayoutComponents) {
        const { componentId, moduleName, parentId, position } = component;

        const { rows: footerLayoutComponentContent } =
          await client.query<StoreLayoutComponentContentType>(
            this.layoutQueryString.getPageLayoutComponentContent(
              componentId!,
              storeLanguageId
            )
          );

        const { id: footerContentId, data } =
          footerLayoutComponentContent[0] ?? {};

        let footerData = {};
        if (data) {
          footerData = Buffer.from(
            JSON.stringify(
              footerContentId ? { contentId: footerContentId, ...data } : {}
            ),
            'utf-8'
          ).toString('base64');
        }

        if (!parentId) {
          layout[PageLayoutBlocks.Footer] = {
            ...layout[PageLayoutBlocks.Footer],
            layoutBlockId: footerLayoutBlockId,
            componentId,
            moduleName,
            position,
            data: footerData,
          };
        } else {
          layout[PageLayoutBlocks.Footer].children.push({
            layoutBlockId: footerLayoutBlockId,
            componentId,
            moduleName,
            position,
            data: footerData,
          });
        }
      }

      //** ***** JSS-MAIN *****
      const { rows: mainLayoutBlockRows } =
        await client.query<StoreLayoutBlockType>(
          this.layoutQueryString.GetPageLayoutBlocks(
            layoutId,
            PageLayoutBlocks.Main
          )
        );

      const { id: mainLayoutBlockId } = mainLayoutBlockRows[0];

      const { rows: mainLayoutComponents } =
        await client.query<StoreLayoutComponentType>(
          this.layoutQueryString.getPageLayoutComponents(mainLayoutBlockId)
        );

      let main: StoreLayoutComponentType[] = [];

      for await (const component of mainLayoutComponents) {
        const { componentId, moduleName, parentId, position } = component;

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
          layoutBlockId: mainLayoutBlockId,
          parentId,
          componentId,
          moduleName,
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

      layout[PageLayoutBlocks.Main] = childrenOf('null');

      const { rows: languageRows } = await client.query<{ localeId: string }>(
        this.layoutQueryString.getLanguageLocaleId(storeLanguageId)
      );

      const { localeId } = languageRows[0];

      /** Set the resources in the cache store */
      if (layout && storeId) {
        this.layoutCacheStore.setPageLayout({
          storeId,
          page,
          storeLanguageId,
          localeId,
          resource: layout,
        });
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
