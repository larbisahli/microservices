import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class CategoryQueryString extends CommonQueryString {
  public getCategory(id: number) {
    const text = `SELECT cate.id, cate.parent_id AS "parentId", cate.include_in_menu AS "includeInMenu", cate.position,
    cate.url_key AS "urlKey", cate.meta_robots AS "metaRobots", cate.breadcrumbs_priority AS "breadcrumbsPriority",
    ARRAY((SELECT json_build_object('id', media_seo.id, 'image', media_seo.image_path, 'placeholder', media_seo.placeholder_path)
    FROM media AS media_seo WHERE media_seo.store_id = current_setting('app.current_store_id')::uuid AND media_seo.id = cate.og_media_id )) AS "metaImage",

    -- thumbnail
    ARRAY((SELECT json_build_object('id', media.id, 'image', media.image_path, 'placeholder', media.placeholder_path)
    FROM media AS media WHERE media.store_id = current_setting('app.current_store_id')::uuid AND media.id = cate.media_id )) AS thumbnail,

    -- parent
    (SELECT json_build_object('id', parent_cate.id) FROM category AS parent_cate
    WHERE parent_cate.store_id = current_setting('app.current_store_id')::uuid AND parent_cate.id = cate.parent_id) AS parent,

    -- check if it has children
    (SELECT EXISTS(SELECT cate_check.id FROM category AS cate_check
    WHERE cate_check.store_id = current_setting('app.current_store_id')::uuid AND cate_check.parent_id = cate.id)) AS "hasChildren"
    FROM category AS cate WHERE cate.store_id = current_setting('app.current_store_id')::uuid AND cate.id = $1`;
    return {
      name: 'get-category',
      text,
      values: [id],
    };
  }

  public getCategoryLevelById(id: number, storeLanguageId: number) {
    const text = `SELECT cate.id, cate.parent_id AS "parentId", cate.level,
    (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = $1 AND language_id = $2 )
    FROM category AS cate WHERE cate.store_id = current_setting('app.current_store_id')::uuid AND cate.id = $1`;
    return {
      name: 'get-category-level-by-id',
      text,
      values: [id, storeLanguageId],
    };
  }

  // This should trigger index only scan
  public getCategoryUrlKeyById(id: number) {
    const text = `SELECT url_key as "urlKey" FROM category WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;
    return {
      name: 'get-category-url-key-by-id',
      text,
      values: [id],
    };
  }

  public getStoreCategoryIdByUrlKey(urlKey: string) {
    const text = `SELECT id FROM category WHERE store_id = current_setting('app.current_store_id')::uuid AND url_key = $1`;
    return {
      name: 'get-store-category-id-by-url-key',
      text,
      values: [urlKey],
    };
  }

  public getMenu(languageId: number) {
    const text = `SELECT cate_level1.id, cate_level1.url_key AS "urlKey",
    (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate_level1.id AND language_id = $1),
    -- Children
    ARRAY((SELECT json_build_object('id', cate_level2.id,
    'name', (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate_level2.id AND language_id = $1),
    'urlKey', cate_level2.url_key, 'children', ARRAY((SELECT json_build_object('id', cate_level3.id,
    'name', (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate_level3.id AND language_id = $1), 'urlKey', cate_level3.url_key)
    FROM category AS cate_level3 WHERE cate_level3.store_id = current_setting('app.current_store_id')::uuid
    AND cate_level3.parent_id = cate_level2.id AND cate_level3.include_in_menu is TRUE ORDER BY cate_level3.position ASC)))
    FROM category AS cate_level2 WHERE cate_level2.store_id = current_setting('app.current_store_id')::uuid
    AND cate_level2.parent_id = cate_level1.id AND cate_level2.include_in_menu is TRUE ORDER BY cate_level2.position ASC)) AS children
    FROM category AS cate_level1 WHERE cate_level1.store_id = current_setting('app.current_store_id')::uuid AND cate_level1.level = 1
    AND cate_level1.parent_id IS NULL AND cate_level1.include_in_menu is TRUE ORDER BY cate_level1.position ASC`;
    return {
      name: 'get-menu',
      text,
      values: [languageId],
    };
  }

  public getHomePageCategories(languageId: number) {
    const text = `SELECT cate.id, cate.url_key AS "urlKey",
    (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate.id AND language_id = $1),
    -- thumbnail
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = cate.media_id )) AS thumbnail
    FROM category AS cate WHERE cate.store_id = current_setting('app.current_store_id')::uuid ORDER BY cate.position ASC LIMIT 10`;
    return {
      name: 'get-home-page-categories',
      text,
      values: [languageId],
    };
  }

  public getStoreCategory(urlKey: string, languageId: number) {
    const text = `SELECT cate.id, cate.parent_id AS "parentId", cate.url_key AS "urlKey", cate.meta_robots AS "metaRobots", level, cate.breadcrumbs_priority AS "breadcrumbsPriority",
    ARRAY((SELECT json_build_object('id', media_seo.id, 'image', media_seo.image_path, 'placeholder', media_seo.placeholder_path)
    FROM media AS media_seo WHERE media_seo.store_id = current_setting('app.current_store_id')::uuid AND media_seo.id = cate.og_media_id )) AS "metaImage",

    -- thumbnail
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = cate.media_id )) AS "thumbnail",

    -- Children
    ARRAY((SELECT json_build_object(
    'id', cate_level2.id,
    'urlKey', cate_level2.url_key,
    'name', (SELECT ct.name FROM category_translation AS ct WHERE ct.store_id = current_setting('app.current_store_id')::uuid AND ct.category_id = cate_level2.id AND ct.language_id = $2),
    'thumbnail', ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = cate_level2.media_id )))
    FROM category AS cate_level2 WHERE cate_level2.store_id = current_setting('app.current_store_id')::uuid AND cate_level2.parent_id = cate.id ORDER BY cate_level2.position ASC)) AS "children"

    FROM category AS cate WHERE cate.store_id = current_setting('app.current_store_id')::uuid AND cate.url_key = $1`;
    return {
      name: 'get-store-category',
      text,
      values: [urlKey, languageId],
    };
  }

  public getStoreCategoryTranslation(id: number, languageId: number) {
    const text = `SELECT name, description, meta_title AS "metaTitle", meta_keywords AS "metaKeywords", meta_description AS "metaDescription"
    FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = $1 AND language_id = $2`;
    return {
      name: 'get-store-category-translation',
      text,
      values: [id, languageId],
    };
  }
}
