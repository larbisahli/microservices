import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class LayoutQueryString extends CommonQueryString {
  public getStoreTemplateId() {
    const text = `SELECT store_template_id AS "templateId" FROM store_settings WHERE store_id = current_setting('app.current_store_id')::uuid`;
    return {
      name: 'get-template-id',
      text,
      values: [],
    };
  }

  public getPageLayout(templateId: string, pageName: string) {
    const text = `SELECT id, name FROM store_layout WHERE store_id = current_setting('app.current_store_id')::uuid AND template_id = $1 AND name = $2`;
    return {
      name: 'get-page-layout',
      text,
      values: [templateId, pageName],
    };
  }

  public GetPageLayoutBlocks(layoutId: string, identifier: string) {
    const text = `SELECT id FROM store_layout_block WHERE store_id = current_setting('app.current_store_id')::uuid AND layout_id = $1 AND identifier = $2`;
    return {
      name: 'get-page-layout-blocks',
      text,
      values: [layoutId, identifier],
    };
  }

  public getPageLayoutComponents(layoutBlockId: string) {
    const text = `SELECT id AS "componentId", parent_id AS "parentId", module_name AS "moduleName", position, has_children AS "hasChildren" FROM store_layout_component WHERE store_id = current_setting('app.current_store_id')::uuid AND layout_block_id = $1`;
    return {
      name: 'get-page-layout-block-components',
      text,
      values: [layoutBlockId],
    };
  }

  public getPageLayoutComponentContent(
    componentId: string | number,
    languageId: number
  ) {
    const text = `SELECT id, data FROM store_layout_component_content WHERE store_id = current_setting('app.current_store_id')::uuid AND layout_component_id = $1 AND language_id = $2`;
    return {
      name: 'get-page-layout-block-component-content',
      text,
      values: [componentId, languageId],
    };
  }
}
