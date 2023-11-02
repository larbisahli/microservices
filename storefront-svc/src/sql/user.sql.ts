import { UserType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class User_accountQueryString extends CommonQueryString {
  public getUserForLogin() {
    const text = `SELECT id, password, active, store_id AS "storeId"
                  FROM user_account WHERE email = current_setting('app.current_user_email')::VARCHAR(255)`;

    return {
      text,
      values: [],
    };
  }

  public getUserByEmail(email: string) {
    const text = `SELECT id, email, active FROM user_account WHERE store_id = current_setting('app.current_store_id')::uuid AND email = $1`;

    return {
      text,
      values: [email],
    };
  }

  public getStoreInfoById() {
    const text = `SELECT id, alias, published, tier, status,
    (SELECT store_name from store_settings AS st WHERE st.store_id = current_setting('app.current_store_id')::uuid) AS "storeName"
    FROM store WHERE id = current_setting('app.current_store_id')::uuid`;

    return {
      text,
      values: [],
    };
  }

  public getUserById(id: string) {
    const text = `SELECT user_account.id, user_account.first_name AS "firstName", user_account.last_name AS "lastName",
      user_account.phone_number AS "phoneNumber", user_account.email, user_account.is_admin AS "isAdmin",
      -- Profile image
      ARRAY((SELECT json_build_object('id', media.id, 'image', media.image_path, 'placeholder', media.placeholder_path) FROM media AS media
      WHERE media.store_id = current_setting('app.current_store_id')::uuid AND media.id = user_account.media_id)) as profile, user_account.active,
      -- Role
      (SELECT json_build_object('id', r.id::integer, 'name', r.name) FROM acl_user_role AS r WHERE r.id  = user_account.role_id) AS role
      FROM user_account AS user_account WHERE user_account.store_id = current_setting('app.current_store_id')::uuid AND user_account.id = $1`;

    return {
      name: 'get-user-by-id',
      text,
      values: [id],
    };
  }

  public getUserByIdForResetPassword(id: string) {
    const text = `SELECT id, rp_token, rp_token_created_at FROM user_account WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-user-by-id-for-reset-password',
      text,
      values: [id],
    };
  }

  public getUsers(limit: number, offset: number) {
    const text = `SELECT user_account.id, user_account.first_name AS "firstName", user_account.last_name AS "lastName", user_account.email, user_account.phone_number AS "phoneNumber", user_account.active, user_account.created_at AS "createdAt", user_account.is_admin AS "isAdmin",
                  -- Profile image
                  ARRAY((SELECT json_build_object('image', media.image_path, 'placeholder', media.placeholder_path) FROM media AS media WHERE  media.store_id = current_setting('app.current_store_id')::uuid AND media.id = user_account.media_id)) as profile,
                  -- Created/Updated by
                  (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
                  WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = user_account.created_by) AS "createdBy",
                  (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
                  WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = user_account.updated_by) AS "updatedBy",
                  -- Role
                  (SELECT json_build_object('id', r.id::integer, 'name', r.name) FROM acl_user_role AS r WHERE r.id  = user_account.role_id) AS role
                  FROM user_account AS user_account WHERE user_account.store_id = current_setting('app.current_store_id')::uuid ORDER BY user_account.created_at ASC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-users',
      text,
      values: [limit, offset],
    };
  }

  public createAdminUser(...args: UserType[keyof UserType][]) {
    const text = `INSERT INTO user_account(store_id, is_admin, first_name, last_name, email,
      password, role_id, phone_number, accept_condition)
      VALUES(current_setting('app.current_store_id')::uuid, TRUE, $1, $2, $3, $4, $5, $6, $7) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public insert(...args: UserType[keyof UserType][]) {
    const text = `INSERT INTO user_account(store_id, is_admin, first_name, last_name, phone_number,
                  password, role_id, media_id, email, rp_token, rp_token_created_at, created_by)
                  VALUES(current_setting('app.current_store_id')::uuid, FALSE, $1, $2, $3, $4, $5, $6, $7, $8, NOW(), current_setting('app.current_user_id')::uuid)
                  RETURNING id, first_name AS "firstName", last_name AS "lastName"`;

    return {
      text,
      values: [...args],
    };
  }

  public updateForPasswordChange(...args: UserType[keyof UserType][]) {
    const text = `UPDATE user_account SET password = $2,  rp_token = NULL, rp_token_created_at = NULL,
                  updated_by = $1 WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [...args],
    };
  }

  public checkEmailNumber(email: string) {
    const text = `SELECT exists (SELECT email FROM user_account WHERE store_id = current_setting('app.current_store_id')::uuid AND email = $1 LIMIT 1)`;

    return {
      text,
      values: [email],
    };
  }

  public update(...args: UserType[keyof UserType][]) {
    const text = `UPDATE user_account SET first_name = $2, last_name = $3, phone_number = $4,
                  email = $5, media_id = $6, role_id = $7, updated_by = current_setting('app.current_user_id')::uuid
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id, first_name As "firstName", last_name AS "lastName"`;

    return {
      text,
      values: [...args],
    };
  }

  public delete(id: string) {
    const text = `DELETE FROM user_account WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id, first_name AS "firstName", last_name AS "lastName"`;

    return {
      text,
      values: [id],
    };
  }

  public ban(id: string, active: boolean) {
    const text = `UPDATE user_account SET active = $2, updated_by = current_setting('app.current_user_id')::uuid
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id, first_name AS "firstName", last_name AS "lastName"`;

    return {
      text,
      values: [id, active],
    };
  }
}
