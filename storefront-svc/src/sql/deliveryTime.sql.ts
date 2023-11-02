import { DeliveryTimeType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class DeliveryTimeQueryString extends CommonQueryString {
  public getDeliveryTime(id: number) {
    const text = `SELECT id, jsonb_build_object('unit', unit) AS unit, min, max FROM delivery_time WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-delivery-time',
      text,
      values: [id],
    };
  }

  public getDeliveryTimeTranslation(languageId: number, id: number) {
    const text = `SELECT name FROM delivery_time_transaction WHERE store_id = current_setting('app.current_store_id')::uuid AND language_id = $1 AND delivery_time_id = $2`;

    return {
      name: 'get-delivery-time-translation',
      text,
      values: [languageId, id],
    };
  }

  public getDeliveryTimes(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT dt.id, jsonb_build_object('unit', dt.unit) AS unit, dt.min, dt.max, dt.created_at AS "createdAt", dt.updated_at AS "updatedAt",
    -- Translation
    (SELECT dtt.name FROM delivery_time_transaction AS dtt WHERE dtt.store_id = current_setting('app.current_store_id')::uuid AND dtt.delivery_time_id = dt.id AND dtt.language_id = $1),
    (SELECT json_build_object(
      'name', (SELECT dtd.name FROM delivery_time_transaction AS dtd WHERE dtd.store_id = current_setting('app.current_store_id')::uuid AND dtd.delivery_time_id = dt.id AND dtd.language_id = $2))) AS translated,
     -- Created/Updated by
     (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
     WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = dt.created_by) AS "createdBy",
     (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
     WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = dt.updated_by) AS "updatedBy"

      FROM delivery_time AS dt WHERE dt.store_id = current_setting('app.current_store_id')::uuid ORDER BY dt.created_at ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-delivery-times',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public deliveryTimeSelect(languageId: number, limit: number, offset: number) {
    const text = `SELECT dt.id,
    -- Translation
    (SELECT dtt.name FROM delivery_time_transaction AS dtt WHERE dtt.store_id = current_setting('app.current_store_id')::uuid AND dtt.delivery_time_id = dt.id AND dtt.language_id = $1) AS name
    FROM delivery_time AS dt WHERE dt.store_id = current_setting('app.current_store_id')::uuid ORDER BY dt.created_at ASC LIMIT $2 OFFSET $3`;

    return {
      text,
      values: [languageId, limit, offset],
    };
  }

  public insert(unit: string, min: number, max: number) {
    const text = `INSERT INTO delivery_time (store_id, unit, min, max, created_by)
    VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, current_setting('app.current_user_id')::uuid) RETURNING id`;

    return {
      text,
      values: [unit, min, max],
    };
  }

  public insertTranslation(
    deliveryTimeId: number,
    languageId: number,
    name: string
  ) {
    const text = `INSERT INTO delivery_time_transaction (store_id, delivery_time_id, language_id, name)
    VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3)`;

    return {
      text,
      values: [deliveryTimeId, languageId, name],
    };
  }

  public update(...args: DeliveryTimeType[keyof DeliveryTimeType][]) {
    const text = `UPDATE delivery_time SET unit = $2, min = $3, max = $4, updated_by = current_setting('app.current_user_id')::uuid
            WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updateTranslation(
    ...args: DeliveryTimeType[keyof DeliveryTimeType][]
  ) {
    const text = `INSERT INTO delivery_time_transaction (store_id, delivery_time_id, language_id, name)
    VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3)
            ON CONFLICT (store_id, delivery_time_id, language_id) DO UPDATE SET name = excluded.name`;

    return {
      text,
      values: [...args],
    };
  }

  public delete(id: number) {
    const text = `DELETE FROM delivery_time WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [id],
    };
  }
}
