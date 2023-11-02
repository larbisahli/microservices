import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class OrderStatusQueryString extends CommonQueryString {
  public getOrderStatus(id: number) {
    const text = `SELECT id, color, privacy FROM order_status WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-order-status',
      text,
      values: [id],
    };
  }

  public getOrderStatusTranslation(id: number, languageId: number) {
    const text = `SELECT name FROM order_status_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND order_status_id = $1 AND language_id = $2`;

    return {
      name: 'get-order-status-translation',
      text,
      values: [id, languageId],
    };
  }

  public getOrderStatuses(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    let text = `SELECT os.id, os.color, os.privacy, os.created_at AS "createdAt", os.updated_at AS "updatedAt",
    -- Translation
    (SELECT name FROM order_status_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND order_status_id = os.id AND language_id = $1),
    (SELECT json_build_object(
      'name', (SELECT name FROM order_status_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND language_id = $2 AND order_status_id = os.id))) AS translated,
    -- Created/Updated by
    (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
    WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = os.created_by) AS "createdBy",
    (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
    WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = os.updated_by) AS "updatedBy"
    FROM order_status AS os WHERE os.store_id = current_setting('app.current_store_id')::uuid ORDER BY created_at DESC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-order-statuses',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public insert(color: string, privacy: string) {
    const text = `INSERT INTO order_status(store_id, color, privacy, created_by)
                 VALUES(current_setting('app.current_store_id')::uuid, $1, $2,
                 current_setting('app.current_user_id')::uuid) RETURNING id`;

    return {
      text,
      values: [color, privacy],
    };
  }

  public insertTranslation(
    orderStatusId: number,
    languageId: number,
    name: string
  ) {
    const text = `INSERT INTO order_status_translation (store_id, order_status_id, language_id, name)
                  VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3)`;

    return {
      text,
      values: [orderStatusId, languageId, name],
    };
  }

  public setUpdateBy(id: number) {
    const text = `UPDATE order_status SET updated_by = current_setting('app.current_user_id')::uuid, updated_at = NOW()
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public updateTranslation(
    orderStatusId: number,
    languageId: number,
    name: string
  ) {
    const text = `INSERT INTO order_status_translation (store_id, order_status_id, language_id, name) VALUES
                  (current_setting('app.current_store_id')::uuid, $1, $2, $3)
                  ON CONFLICT (store_id, order_status_id, language_id) DO UPDATE SET name = excluded.name`;

    return {
      text,
      values: [orderStatusId, languageId, name],
    };
  }

  public update(id: number, color: string, privacy: string) {
    const text = `UPDATE order_status SET color = $2, privacy = $3,
             updated_by = current_setting('app.current_user_id')::uuid
             WHERE store_id = current_setting('app.current_store_id')::uuid
             AND id = $1 RETURNING id
          `;

    return {
      text,
      values: [id, color, privacy],
    };
  }

  public delete(id: number) {
    const text = `DELETE FROM order_status WHERE store_id = current_setting('app.current_store_id')::uuid
            AND id = $1 RETURNING id`;

    return {
      text,
      values: [id],
    };
  }
}
