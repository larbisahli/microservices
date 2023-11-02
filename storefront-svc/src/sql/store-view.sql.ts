import { StoreViewType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class StoreViewQueryString extends CommonQueryString {
  public getStoreView(id: number) {
    const text = `SELECT sv.id, sv.name, sv.code, sv.active, sv.is_default AS "isDefault",
    (SELECT json_build_object('id', sg.id, 'displayName', sg.display_name) FROM store_language AS sg
     WHERE sg.store_id = current_setting('app.current_store_id')::uuid AND sg.id = sv.store_language_id) AS language
    FROM store_view AS sv WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-store-view',
      text,
      values: [id],
    };
  }

  public getStoreViews(limit: number, offset: number) {
    const text = `SELECT sv.id, sv.name, sv.code, sv.active, sv.is_default AS "isDefault", sv.updated_at AS "updatedAt", sv.created_at AS "createdAt",
    (SELECT json_build_object('id', sg.id, 'displayName', sg.display_name) FROM store_language AS sg
     WHERE sg.store_id = current_setting('app.current_store_id')::uuid AND sg.id = sv.store_language_id) AS language,
     -- Created/Updated by
     (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
     WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = sv.created_by) AS "createdBy",
     (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
     WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = sv.updated_by) AS "updatedBy"
     FROM store_view AS sv WHERE sv.store_id = current_setting('app.current_store_id')::uuid ORDER BY sv.created_at ASC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-store-views',
      text,
      values: [limit, offset],
    };
  }

  public getStoreViewForSelect(limit: number, offset: number) {
    const text = `SELECT sv.id, sv.name, sv.code FROM store_view AS sv WHERE sv.store_id = current_setting('app.current_store_id')::uuid ORDER BY sv.created_at ASC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-store-view-for-select',
      text,
      values: [limit, offset],
    };
  }

  public update(...args: StoreViewType[keyof StoreViewType][]) {
    const text = `UPDATE store_language SET name = $2, code = $3, store_language_id = $4, is_default = $5, active = $6,
    updated_by = current_setting('app.current_user_id')::uuid WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public create(...args: StoreViewType[keyof StoreViewType][]) {
    const text = `INSERT INTO store_language (store_id, name, code, store_language_id, is_default, active, created_by)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5 current_setting('app.current_user_id')::uuid)
                  RETURNING id, name`;

    return {
      text,
      values: [...args],
    };
  }

  public delete(id: number) {
    const text = `DELETE FROM store_language WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 AND is_default = FALSE RETURNING id`;

    return {
      text,
      values: [id],
    };
  }

  public createDefaultStoreView(...args: StoreViewType[keyof StoreViewType][]) {
    const text = `INSERT INTO store_language (store_id, name, code, store_language_id, is_default, active, updated_at) VALUES
    (current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, NULL)`;

    return {
      text,
      values: [...args],
    };
  }
}
