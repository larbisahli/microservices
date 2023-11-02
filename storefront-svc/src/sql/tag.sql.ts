import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class TagQueryString extends CommonQueryString {
  public getTagTranslation(id: number, languageId: number) {
    const text = `SELECT name FROM tag_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND tag_id = $1 AND language_id = $2`;

    return {
      name: 'get-tag-translation',
      text,
      values: [id, languageId],
    };
  }

  public getTags(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT tg.id, tg.created_at AS "createdAt", tg.updated_at AS "updatedAt",
    -- Translation
    (SELECT ttl.name FROM tag_translation AS ttl WHERE ttl.store_id = current_setting('app.current_store_id')::uuid AND ttl.tag_id = tg.id AND ttl.language_id = $1),
    (SELECT json_build_object(
      'name', (SELECT ttd.name FROM tag_translation AS ttd WHERE ttd.store_id = current_setting('app.current_store_id')::uuid AND ttd.tag_id = tg.id AND ttd.language_id = $2))) AS translated,
     -- Created/Updated by
     (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
     WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = tg.created_by) AS "createdBy",
     (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
     WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = tg.updated_by) AS "updatedBy"
      FROM tag AS tg WHERE tg.store_id = current_setting('app.current_store_id')::uuid ORDER BY tg.created_at ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-tags',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public getTagsForSelect(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT tg.id,
    -- Translation
    (SELECT ttl.name FROM tag_translation AS ttl WHERE ttl.store_id = current_setting('app.current_store_id')::uuid AND ttl.tag_id = tg.id AND ttl.language_id = $1),
    (SELECT json_build_object(
      'name', (SELECT ttd.name FROM tag_translation AS ttd WHERE ttd.store_id = current_setting('app.current_store_id')::uuid AND ttd.tag_id = tg.id AND ttd.language_id = $2))) AS translated
     FROM tag AS tg WHERE store_id = current_setting('app.current_store_id')::uuid ORDER BY created_at ASC LIMIT $3 OFFSET $4`;

    return {
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public insert() {
    const text = `INSERT INTO tag(store_id, created_by) VALUES(current_setting('app.current_store_id')::uuid, current_setting('app.current_user_id')::uuid) RETURNING id`;
    return {
      text,
      values: [],
    };
  }

  public setUpdateBy(id: number) {
    const text = `UPDATE tag SET updated_by = current_setting('app.current_user_id')::uuid, updated_at = NOW()
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public insertTranslation(tagId: number, languageId: number, name: string) {
    const text = `INSERT INTO tag_translation (store_id, tag_id, language_id, name)
                  VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3)`;

    return {
      text,
      values: [tagId, languageId, name],
    };
  }

  // the special 'excluded' table gives you access to the values you were trying to INSERT in the first place.
  public updateTranslation(tagId: number, languageId: number, name: string) {
    const text = `INSERT INTO tag_translation (store_id, tag_id, language_id, name) VALUES
                  (current_setting('app.current_store_id')::uuid, $1, $2, $3)
                  ON CONFLICT (store_id, tag_id, language_id) DO UPDATE SET name = excluded.name`;

    return {
      text,
      values: [tagId, languageId, name],
    };
  }

  public delete(id: number) {
    const text = `DELETE FROM tag WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [id],
    };
  }
}
