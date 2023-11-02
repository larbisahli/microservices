import { LanguageType } from '@ts-types/interfaces';
import Container, { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class LanguageQueryString extends CommonQueryString {
  public getLanguage(id: number) {
    const text = `SELECT id, name, locale_id AS "localeId", direction, active, is_default AS "isDefault",
    translation FROM store_language WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-language',
      text,
      values: [id],
    };
  }

  public getLanguages(limit: number, offset: number) {
    const text = `SELECT sl.id,  sl.name, sl.locale_id AS "localeId", sl.direction, sl.is_default AS "isDefault", sl.is_system AS "isSystem",
    sl.active, sl.updated_at AS "updatedAt", sl.created_at AS "createdAt",
     -- Created/Updated by
     (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
     WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = sl.created_by) AS "createdBy",
     (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
     WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = sl.updated_by) AS "updatedBy"
     FROM store_language AS sl WHERE sl.store_id = current_setting('app.current_store_id')::uuid ORDER BY sl.is_default DESC, sl.created_at DESC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-languages',
      text,
      values: [limit, offset],
    };
  }

  public getLanguagesForSelect(limit: number, offset: number) {
    const text = `SELECT sl.id, sl.locale_id AS "localeId" FROM store_language AS sl WHERE sl.store_id = current_setting('app.current_store_id')::uuid ORDER BY sl.created_at ASC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-languages-for-select',
      text,
      values: [limit, offset],
    };
  }

  // public fork(id: number) {
  //   const text = `INSERT INTO store_language (store_id, display_name, lcid, direction, is_default, translation, updated_at, updated_by)
  //                 SELECT store_id, display_name, lcid, direction, FALSE AS is_default, translation, NOW() AS "updated_at", current_setting('app.current_user_id')::uuid AS "updated_by"
  //                 FROM store_language WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id, display_name AS "displayName"`;

  //   return {
  //     text,
  //     values: [id],
  //   };
  // }

  public update(...args: LanguageType[keyof LanguageType][]) {
    const text = `UPDATE store_language SET name = $2, direction = $3, locale_id = $4, translation = $5, active = $6,
    updated_by = current_setting('app.current_user_id')::uuid WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public setDefault(id: number, isDefault: boolean) {
    const text = `UPDATE store_language SET is_default = $2, updated_by = current_setting('app.current_user_id')::uuid WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [id, isDefault],
    };
  }

  public getDefaultLanguage() {
    const text = `SELECT id, name, locale_id AS "localeId", direction, translation
                  FROM store_language WHERE store_id = current_setting('app.current_store_id')::uuid AND is_default = TRUE`;

    return {
      name: 'get-default-language',
      text,
      values: [],
    };
  }

  public getDefaultLanguageId() {
    const text = `SELECT id FROM store_language WHERE store_id = current_setting('app.current_store_id')::uuid AND is_default = TRUE`;

    return {
      name: 'get-default-language',
      text,
      values: [],
    };
  }

  public create(...args: LanguageType[keyof LanguageType][]) {
    const text = `INSERT INTO store_language (store_id, name, locale_id, direction, is_default, translation, created_by)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, FALSE, $4, current_setting('app.current_user_id')::uuid)
                  RETURNING id, name`;

    return {
      text,
      values: [...args],
    };
  }

  public delete(id: number) {
    const text = `DELETE FROM store_language WHERE store_id = current_setting('app.current_store_id')::uuid
     AND id = $1 AND is_default = FALSE AND is_system = FALSE RETURNING id, is_system AS "isSystem"`;

    return {
      text,
      values: [id],
    };
  }

  public createDefaultLanguages(
    name: string,
    localeId: string,
    direction: string,
    iso2: string,
    active: boolean,
    isDefault: boolean,
    isSystem: boolean,
    translation: { [key: string]: string }
  ) {
    const text = `INSERT INTO store_language (
      store_id, name, locale_id, iso2, direction, is_default,
      is_system, active, translation, updated_at) VALUES
    (current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7, $8, NULL)`;

    return {
      text,
      values: [
        name,
        localeId,
        iso2,
        direction,
        isDefault,
        isSystem,
        active,
        translation,
      ],
    };
  }
}

const { getDefaultLanguageId } = Container.get(LanguageQueryString);

export { getDefaultLanguageId };
