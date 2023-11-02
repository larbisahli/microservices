import { CategoryType } from '@ts-types/interfaces';
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

  public getCategoryTranslation(id: number, languageId: number) {
    const text = `SELECT name, description, meta_title AS "metaTitle", meta_keywords AS "metaKeywords", meta_description AS "metaDescription"
                  FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = $1 AND language_id = $2`;

    return {
      name: 'get-category-translation',
      text,
      values: [id, languageId],
    };
  }

  public getCategoryLevelById(id: number) {
    const text = `SELECT cate.id, cate.parent_id AS "parentId", cate.level FROM category AS cate
            WHERE cate.store_id = current_setting('app.current_store_id')::uuid AND cate.id = $1`;

    return {
      name: 'get-category-level-by-id',
      text,
      values: [id],
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

  public getCategories(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT cate_level1.id, cate_level1.parent_id AS "parentId", cate_level1.created_at AS "createdAt", cate_level1.updated_at AS "updatedAt", cate_level1.include_in_menu AS "includeInMenu", cate_level1.level, cate_level1.position,
    -- translation
    (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate_level1.id AND language_id = $1),
    (SELECT json_build_object('name', (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate_level1.id AND language_id = $2))) AS translated,

    -- Created/Updated by
     (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = cate_level1.created_by) AS "createdBy",
     (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = cate_level1.updated_by) AS "updatedBy",

     -- Children
    ARRAY((SELECT json_build_object('id', cate_level2.id, 'parentId', cate_level2.parent_id,
    'name', (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate_level2.id AND language_id = $1),
    'translated', (SELECT json_build_object('name', name) FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate_level2.id AND language_id = $2) ,
    'createdAt', cate_level2.created_at, 'updatedAt', cate_level2.updated_at, 'includeInMenu', cate_level2.include_in_menu,'level', cate_level2.level, 'position', cate_level2.position,
    'createdBy', (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = cate_level2.created_by),
    'updatedBy', (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = cate_level2.updated_by),
    'children', ARRAY((SELECT json_build_object('id', cate_level3.id, 'parentId', cate_level3.parent_id,
      'name', (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate_level3.id AND language_id = $1),
      'translated', (SELECT json_build_object('name', name) FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate_level3.id AND language_id = $2),
      'includeInMenu', cate_level3.include_in_menu, 'level', cate_level3.level, 'position', cate_level3.position,
      'createdAt', cate_level3.created_at, 'updatedAt', cate_level3.updated_at,
      'createdBy', (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = cate_level3.created_by),
      'updatedBy', (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = cate_level3.updated_by))
    FROM category AS cate_level3 WHERE cate_level3.parent_id = cate_level2.id ORDER BY cate_level3.position ASC)))
    FROM category AS cate_level2 WHERE cate_level2.parent_id = cate_level1.id ORDER BY cate_level2.position ASC)) AS children

    FROM category AS cate_level1 WHERE cate_level1.store_id = current_setting('app.current_store_id')::uuid AND cate_level1.level = 1 AND cate_level1.parent_id IS NULL ORDER BY cate_level1.position ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-categories',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public getMenu() {
    const text = `SELECT cate_level1.id, cate_level1.category_name AS name,
    (SELECT seo.url_key FROM category_seo AS seo WHERE seo.store_id = current_setting('app.current_store_id')::uuid AND seo.category_id = cate_level1.id) AS "url",
    -- thumbnail
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM photos AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = cate_level1.media_id )) AS thumbnail,
    -- Children
    ARRAY((SELECT json_build_object('id', cate_level2.id, 'name', cate_level2.category_name, 'thumbnail',
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM photos AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = cate_level2.media_id )),
    'url', (SELECT seo.url_key FROM category_seo AS seo WHERE seo.store_id = current_setting('app.current_store_id')::uuid AND seo.category_id = cate_level2.id),
    'children',
    ARRAY((SELECT json_build_object('id', cate_level3.id, 'name', cate_level3.category_name, 'thumbnail',
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM photos AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = cate_level3.media_id )),
    'url', (SELECT seo.url_key FROM category_seo AS seo WHERE seo.store_id = current_setting('app.current_store_id')::uuid AND seo.category_id = cate_level3.id))
    FROM category AS cate_level3 WHERE cate_level3.parent_id = cate_level2.id ORDER BY cate_level3.position ASC)))

    FROM category AS cate_level2 WHERE cate_level2.parent_id = cate_level1.id ORDER BY cate_level2.position ASC)) AS children
    FROM category AS cate_level1 WHERE cate_level1.store_id = current_setting('app.current_store_id')::uuid AND cate_level1.level = 1
    AND cate_level1.parent_id IS NULL ORDER BY cate_level1.position ASC`;

    return {
      name: 'get-menu',
      text,
      values: [],
    };
  }

  public getStoreCategory(id: number) {
    const text = `SELECT cate.id, cate.parent_id AS "parentId", cate.category_name AS name, cate.level, cate.category_description AS description, cate.include_in_menu AS "includeInMenu", cate.position,
    -- thumbnail
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM photos AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = cate.media_id )) AS "thumbnail",
    -- Children
    ARRAY((
      SELECT json_build_object('id', cate_level2.id, 'name', cate_level2.category_name,
    'thumbnail', ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM photos AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = cate_level2.media_id )),
    'categorySeo', (SELECT json_build_object('urlKey', (SELECT seo.url_key FROM category_seo AS seo WHERE seo.store_id = current_setting('app.current_store_id')::uuid AND seo.category_id = cate_level2.id))))
    FROM category AS cate_level2 WHERE cate_level2.parent_id = cate.id ORDER BY cate_level2.position ASC)) AS "children"

    FROM category AS cate WHERE cate.store_id = current_setting('app.current_store_id')::uuid AND cate.id = $1`;

    return {
      name: 'get-store-category',
      text,
      values: [id],
    };
  }

  public getStoreCategorySeo(urlKey: string) {
    const text = `SELECT url_key AS "urlKey", category_id AS "categoryId", meta_title AS "metaTitle", meta_keywords AS "metaKeywords",
    meta_description AS "metaDescription", meta_robots AS "metaRobots", breadcrumbs_priority AS "breadcrumbsPriority",
    ARRAY(SELECT json_build_object('id', photo_seo.id, 'image', photo_seo.image_path, 'placeholder', photo_seo.placeholder_path)
    FROM photos AS photo_seo WHERE photo_seo.store_id = current_setting('app.current_store_id')::uuid AND photo_seo.id = media_id) as "metaImage"
    FROM category_seo WHERE store_id = current_setting('app.current_store_id')::uuid AND url_key = $1`;

    return {
      name: 'get-store-category-seo',
      text,
      values: [urlKey],
    };
  }

  public getStoreCategoryIdByUrlKey(urlKey: string) {
    const text = `SELECT category_id AS "categoryId" FROM category_seo WHERE store_id = current_setting('app.current_store_id')::uuid AND url_key = $1`;

    return {
      name: 'get-store-category-id-by-url-key',
      text,
      values: [urlKey],
    };
  }

  public getCategoriesParentsSelect(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT cate.id,
    (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate.id AND language_id = $1),
    (SELECT json_build_object('name', name) FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate.id AND language_id = $2) AS translated
    FROM category AS cate WHERE cate.store_id = current_setting('app.current_store_id')::uuid AND cate.level != 3 ORDER BY cate.level ASC, cate.position ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-categories-parents-select',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public getCategoriesParentsSelectWithId(
    id: number,
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT cate.id,
    (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate.id AND language_id = $2),
    (SELECT json_build_object('name', name) FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate.id AND language_id = $3) AS translated
     FROM category AS cate WHERE cate.store_id = current_setting('app.current_store_id')::uuid AND cate.level != 3 AND cate.id != $1 ORDER BY cate.level ASC, cate.position ASC LIMIT $4 OFFSET $5`;

    return {
      name: 'get-categories-parents-select-with-id',
      text,
      values: [id, languageId, defaultLanguageId, limit, offset],
    };
  }

  public getCategoriesSelectAll(
    language: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT cate.id,
                  -- translation
                  (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate.id AND language_id = $1),
                  (SELECT json_build_object(
                    'name', (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate.id AND language_id = $2))) AS translated
                  FROM category AS cate
                  WHERE cate.store_id = current_setting('app.current_store_id')::uuid
                  ORDER BY cate.level ASC, cate.position ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-categories-select-all',
      text,
      values: [language, defaultLanguageId, limit, offset],
    };
  }

  public insert(...args: CategoryType[keyof CategoryType][]) {
    const text = `INSERT INTO category(store_id, parent_id, media_id, url_key, level, position, include_in_menu, meta_robots, breadcrumbs_priority, og_media_id, created_by)
            VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7, $8, $9, current_setting('app.current_user_id')::uuid)
            RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public insertCategoryTranslation(
    ...args: CategoryType[keyof CategoryType][]
  ) {
    const text = `INSERT INTO category_translation(store_id, category_id, language_id, name, description, meta_title, meta_keywords, meta_description)
            VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7)`;

    return {
      text,
      values: [...args],
    };
  }

  public update(...args: CategoryType[keyof CategoryType][]) {
    const text = `UPDATE category SET parent_id = $2, url_key = $3, media_id = $4, position = $5, include_in_menu = $6,
           meta_robots = $7, breadcrumbs_priority = $8, og_media_id = $9, updated_by = current_setting('app.current_user_id')::uuid
           WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updateCategoryTranslation(
    ...args: CategoryType[keyof CategoryType][]
  ) {
    const text = `INSERT INTO category_translation(store_id, category_id, language_id, name, description, meta_title, meta_keywords, meta_description)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7)
                  ON CONFLICT (store_id, category_id, language_id) DO UPDATE SET
                  name = excluded.name, description = excluded.description, meta_title = excluded.meta_title,
                  meta_keywords = excluded.meta_keywords, meta_description = excluded.meta_description`;

    return {
      text,
      values: [...args],
    };
  }
}
