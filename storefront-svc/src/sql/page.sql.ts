import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class PageQueryString extends CommonQueryString {
  public getPage(slug: string) {
    const text = `SELECT pg.id, pg.slug, ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo
                  WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = pg.og_media_id)) as "ogMedia"
                  FROM store_page as pg WHERE pg.store_id = current_setting('app.current_store_id')::uuid AND pg.slug = $1 AND pg.published IS TRUE`;

    return {
      name: 'get-store-page',
      text,
      values: [slug],
    };
  }

  public getPageTranslation(id: string, languageId: number) {
    const text = `SELECT name, content, meta_title AS "metaTitle", meta_description AS "metaDescription"
    FROM store_page_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND store_page_id = $1 AND language_id = $2`;

    return {
      name: 'get-store-page-translation',
      text,
      values: [id, languageId],
    };
  }
}
