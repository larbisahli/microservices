import { AttributesType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

/**
 * Create a prepared statement to avoid the overhead of parsing,
 * analyzing and planning a SQL statement each time it is executed.
 * When we have a prepared statement, the statement is parsed, planned, and optimized once and then cached in memory.
 */

// Use MATERIALIZED for analytics in sql

@Service()
export default class AttributeQueryString extends CommonQueryString {
  public getAttribute(id: number) {
    const text = `SELECT id, type FROM attribute WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-attribute',
      text,
      values: [id],
    };
  }

  public getAttributeTranslation(id: number, languageId: number) {
    const text = `SELECT name FROM attribute_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND attribute_id = $1 AND language_id = $2`;

    return {
      name: 'get-attribute-translation',
      text,
      values: [id, languageId],
    };
  }

  public getAttributeValues(
    id: number,
    languageId: number,
    defaultLanguageId: number
  ) {
    const text = `SELECT att_v.id,
    (SELECT name from attribute_value_translation AS att_v_t WHERE att_v_t.store_id = current_setting('app.current_store_id')::uuid AND att_v_t.attribute_value_id = att_v.id AND att_v_t.language_id = $2),
    (SELECT value from attribute_value_translation AS att_v_t WHERE att_v_t.store_id = current_setting('app.current_store_id')::uuid AND att_v_t.attribute_value_id = att_v.id AND att_v_t.language_id = $2),
    (SELECT json_build_object('name', att_v_td.name, 'value', att_v_td.value) FROM attribute_value_translation AS att_v_td WHERE att_v_td.store_id = current_setting('app.current_store_id')::uuid AND att_v_td.attribute_value_id = att_v.id AND att_v_td.language_id = $3) AS translated
     FROM attribute_value AS att_v WHERE att_v.store_id = current_setting('app.current_store_id')::uuid AND att_v.attribute_id = $1`;

    return {
      name: 'get-attribute-values',
      text,
      values: [id, languageId, defaultLanguageId],
    };
  }

  public getAttributes(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT att.id, att.type, att.created_at AS "createdAt", att.updated_at AS "updatedAt",
    -- Translation
    (SELECT atl.name FROM attribute_translation AS atl WHERE atl.store_id = current_setting('app.current_store_id')::uuid AND atl.language_id = $1 AND atl.attribute_id = att.id),
    (SELECT json_build_object('name', (SELECT atd.name FROM attribute_translation AS atd WHERE atd.store_id = current_setting('app.current_store_id')::uuid AND atd.language_id = $2 AND atd.attribute_id = att.id))) AS translated,
    -- Created/Updated by
    (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = att.created_by) AS "createdBy",
    (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = att.updated_by) AS "updatedBy",
    -- Attribute values
    ARRAY((SELECT json_build_object(
        'id', att_v.id,
        'name', (SELECT atv_l1.name FROM attribute_value_translation AS atv_l1 WHERE atv_l1.store_id = current_setting('app.current_store_id')::uuid AND atv_l1.language_id = $1 AND atv_l1.attribute_value_id = att_v.id),
        'value', (SELECT atv_l2.value FROM attribute_value_translation AS atv_l2 WHERE atv_l2.store_id = current_setting('app.current_store_id')::uuid AND atv_l2.language_id = $1 AND atv_l2.attribute_value_id = att_v.id),
        'translated', (SELECT json_build_object(
          'name', (SELECT atv_d1.name FROM attribute_value_translation AS atv_d1 WHERE atv_d1.store_id = current_setting('app.current_store_id')::uuid AND atv_d1.language_id = $2 AND atv_d1.attribute_value_id = att_v.id),
          'value', (SELECT atv_d2.value FROM attribute_value_translation AS atv_d2 WHERE atv_d2.store_id = current_setting('app.current_store_id')::uuid AND atv_d2.language_id = $2 AND atv_d2.attribute_value_id = att_v.id)
          ))
      ) FROM attribute_value AS att_v WHERE att_v.store_id = current_setting('app.current_store_id')::uuid AND att_v.attribute_id = att.id)) AS values
    FROM attribute AS att WHERE att.store_id = current_setting('app.current_store_id')::uuid ORDER BY att.created_at ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-attributes',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public insertAttribute(type: string) {
    const text = `INSERT INTO attribute (store_id, type, created_by) VALUES
    (current_setting('app.current_store_id')::uuid, $1, current_setting('app.current_user_id')::uuid) RETURNING id`;

    return {
      text,
      values: [type],
    };
  }

  public insertAttributeTranslation(
    attributeId: number,
    languageId: number,
    name: string
  ) {
    const text = `INSERT INTO attribute_translation (store_id, attribute_id, language_id, name) VALUES
    (current_setting('app.current_store_id')::uuid, $1, $2, $3) RETURNING attribute_id AS "attributeId"`;

    return {
      text,
      values: [attributeId, languageId, name],
    };
  }

  public updateAttributeTranslation(
    attributeId: number,
    languageId: number,
    name: string
  ) {
    const text = `INSERT INTO attribute_translation (store_id, attribute_id, language_id, name) VALUES
    (current_setting('app.current_store_id')::uuid, $1, $2, $3)
    ON CONFLICT (store_id, attribute_id, language_id) DO UPDATE SET name = excluded.name`;

    return {
      text,
      values: [attributeId, languageId, name],
    };
  }

  public updateAttribute(id: number, type: string) {
    const text = `UPDATE attribute SET type = $2, updated_by = current_setting('app.current_user_id')::uuid WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [id, type],
    };
  }

  public deleteAttribute(id: number) {
    const text = `DELETE FROM attribute WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING attribute_name AS name`;

    return {
      text,
      values: [id],
    };
  }

  public insertAttributeValue(attributeId: number) {
    const text = `INSERT INTO attribute_value(store_id, attribute_id) VALUES(current_setting('app.current_store_id')::uuid, $1) RETURNING id`;

    return {
      text,
      values: [attributeId],
    };
  }

  public insertAttributeValuesTranslation(
    att_v_id: number,
    languageId: number,
    value: string,
    name?: string
  ) {
    const text = `INSERT INTO attribute_value_translation (store_id, attribute_value_id, language_id, name, value) VALUES
    (current_setting('app.current_store_id')::uuid, $1, $2, NULLIF($3, $4), $4)`;

    return {
      text,
      values: [att_v_id, languageId, name, value],
    };
  }

  public updateAttributeValues(
    ...args: AttributesType[keyof AttributesType][]
  ) {
    const text = `UPDATE attribute_value SET attribute_value = $2, color = $3
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [...args],
    };
  }

  public updateAttributeValueTranslation(
    att_v_id: number,
    languageId: number,
    value: string,
    name?: string
  ) {
    const text = `INSERT INTO attribute_value_translation (store_id, attribute_value_id, language_id, name, value) VALUES
    (current_setting('app.current_store_id')::uuid, $1, $2, NULLIF($3, $4), $4)
    ON CONFLICT (store_id, attribute_value_id, language_id) DO UPDATE SET name = excluded.name, value = excluded.value`;

    return {
      text,
      values: [att_v_id, languageId, name, value],
    };
  }

  public deleteAttributeValue(id: number) {
    const text = `DELETE FROM attribute_value WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING attribute_value AS value`;

    return {
      text,
      values: [id],
    };
  }

  public deleteAttributeValues(id: number) {
    const text = `DELETE FROM attribute_value WHERE store_id = current_setting('app.current_store_id')::uuid AND attribute_id = $1`;

    return {
      text,
      values: [id],
    };
  }
}
