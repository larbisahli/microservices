import type { PageType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class PageQueryString extends CommonQueryString {
  public getPage(slug: string) {
    const text = `SELECT pg.id, pg.slug, pg.published, ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo
                  WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = pg.og_media_id)) as "ogMedia"
                  FROM store_page as pg WHERE store_id = current_setting('app.current_store_id')::uuid AND slug = $1`;

    return {
      name: 'get-page',
      text,
      values: [slug],
    };
  }

  public getPageTranslation(id: string, languageId: number) {
    const text = `SELECT name, content, meta_title AS "metaTitle", meta_description AS "metaDescription"
    FROM store_page_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND store_page_id = $1 AND language_id = $2`;

    return {
      name: 'get-page-translation',
      text,
      values: [id, languageId],
    };
  }

  public getStorePage(slug: string) {
    const text = `SELECT pg.id, pg.slug, pg.name, pg.content, (SELECT json_build_object('metaTitle', pg.seo->>'metaTitle', 'metaDescription', pg.seo->>'metaDescription',
        'ogMedia', ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM photos AS photo
        WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = pg.og_media_id)))) AS seo
        FROM store_page as pg WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-store-page',
      text,
      values: [slug],
    };
  }

  public updatePage(...args: PageType[keyof PageType][]) {
    const text = `UPDATE store_page SET og_media_id = $2, updated_by = current_setting('app.current_user_id')::uuid
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND slug = $1 RETURNING id, slug`;

    return {
      text,
      values: [...args],
    };
  }

  public updatePageTranslation(...args: PageType[keyof PageType][]) {
    const text = `INSERT INTO store_page_translation (store_id, store_page_id, language_id, name, content, meta_title, meta_description) VALUES
                  (current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6) ON CONFLICT (store_id, store_page_id, language_id)
                  DO UPDATE SET name = excluded.name, content = excluded.content, meta_title = excluded.meta_title, meta_description = excluded.meta_description`;

    return {
      text,
      values: [...args],
    };
  }

  public insertPages(
    slug: string,
    published: boolean,
    languageId: number,
    name: string,
    content: any,
    metaTitle: string,
    metaDescription: string
  ) {
    const text = `--sql
    WITH page_id AS (INSERT INTO store_page(store_id, slug, published)
    VALUES(current_setting('app.current_store_id')::uuid, $1, $2) RETURNING id)
    INSERT INTO store_page_translation (store_id, store_page_id, language_id, name, content, meta_title, meta_description)
    VALUES (current_setting('app.current_store_id')::uuid, (SELECT id FROM page_id), $3, $4, $5, $6, $7)
    `;

    return {
      text,
      values: [
        slug,
        published,
        languageId,
        name,
        content,
        metaTitle,
        metaDescription,
      ],
    };
  }
}
