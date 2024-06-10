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

  public getPageLayout(
    templateId: string,
    pageName: string,
    isCustom: boolean
  ) {
    const text = `SELECT id, name, title FROM store_layout WHERE store_id = current_setting('app.current_store_id')::uuid AND template_id = $1 AND name = $2 AND is_custom = $3`;
    return {
      name: 'get-page-layout',
      text,
      values: [templateId, pageName, isCustom],
    };
  }

  public getStoreThemeInfo(templateId: string) {
    const text = `SELECT theme_settings AS "themeSettings", publish FROM store_template WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;
    return {
      name: 'get-store-theme-settings',
      text,
      values: [templateId],
    };
  }

  public getCommonLayout(templateId: string) {
    const text = `SELECT id FROM store_common_layout WHERE store_id = current_setting('app.current_store_id')::uuid AND template_id = $1`;
    return {
      name: 'get-common-layout',
      text,
      values: [templateId],
    };
  }

  public getLayoutComponents(layoutId: string, isCommon: boolean) {
    if (isCommon) {
      const text = `SELECT alc.id AS "componentId", alc.parent_id AS "parentId", alc.module_name AS "moduleName", styles,
      alc.position, (SELECT sm.module_group AS "moduleGroup" FROM store_module AS sm WHERE sm.module_name = alc.module_name), alc.has_children AS "hasChildren" FROM store_layout_component alc WHERE alc.store_id = current_setting('app.current_store_id')::uuid AND alc.common_layout_id = $1`;
      return {
        name: 'get-common-layout-components',
        text,
        values: [layoutId],
      };
    } else {
      const text = `SELECT alc.id AS "componentId", alc.parent_id AS "parentId", alc.module_name AS "moduleName", styles,
      alc.position, alc.has_children AS "hasChildren", (SELECT sm.module_group AS "moduleGroup" FROM store_module AS sm WHERE sm.module_name = alc.module_name) FROM store_layout_component alc WHERE alc.store_id = current_setting('app.current_store_id')::uuid AND alc.layout_id = $1 AND alc.is_visible IS TRUE`;
      return {
        name: 'get-layout-components',
        text,
        values: [layoutId],
      };
    }
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
