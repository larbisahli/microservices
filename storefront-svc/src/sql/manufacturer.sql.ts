import { ManufacturerType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class ManufacturerQueryString extends CommonQueryString {
  public getManufacturer(id: number) {
    const text = `SELECT manuf.id, manuf.link, ARRAY((SELECT json_build_object('id', media.id, 'image', media.image_path, 'placeholder', media.placeholder_path)
              FROM media AS media WHERE media.store_id = current_setting('app.current_store_id')::uuid AND media.id = manuf.media_id )) AS logo
              FROM manufacturer AS manuf WHERE manuf.store_id = current_setting('app.current_store_id')::uuid AND manuf.id = $1`;

    return {
      name: 'get-manufacturer',
      text,
      values: [id],
    };
  }

  public getManufacturerTranslation(id: number, languageId: number) {
    const text = `SELECT name, description FROM manufacturer_transaction WHERE store_id = current_setting('app.current_store_id')::uuid AND manufacturer_id = $1 AND language_id = $2`;

    return {
      name: 'get-manufacturer-translation',
      text,
      values: [id, languageId],
    };
  }

  public getManufacturers(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT manuf.id, manuf.link, manuf.created_at AS "createdAt", manuf.updated_at AS "updatedAt",
                  ARRAY((SELECT json_build_object('id', media.id, 'image', media.image_path, 'placeholder', media.placeholder_path)
                  FROM media AS media WHERE media.store_id = current_setting('app.current_store_id')::uuid AND media.id = manuf.media_id )) AS logo,
                  -- Translation
                  (SELECT mtl.name FROM manufacturer_transaction AS mtl WHERE mtl.store_id = current_setting('app.current_store_id')::uuid  AND mtl.manufacturer_id = manuf.id AND mtl.language_id = $1),
                  (SELECT json_build_object(
                    'name', (SELECT mtd.name FROM manufacturer_transaction AS mtd WHERE mtd.store_id = current_setting('app.current_store_id')::uuid AND mtd.manufacturer_id = manuf.id AND mtd.language_id = $2))) AS translated,
                  -- Created/Updated by
                  (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
                  WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = manuf.created_by) AS "createdBy",
                  (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
                  WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = manuf.updated_by) AS "updatedBy"
                  FROM manufacturer AS manuf WHERE manuf.store_id = current_setting('app.current_store_id')::uuid ORDER BY manuf.created_at ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-manufacturers',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public getManufacturersForSelect(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT manuf.id,
    -- Translation
    (SELECT mtl.name FROM manufacturer_transaction AS mtl WHERE mtl.store_id = current_setting('app.current_store_id')::uuid AND mtl.manufacturer_id = manuf.id AND mtl.language_id = $1),
    (SELECT json_build_object(
      'name', (SELECT mtd.name FROM manufacturer_transaction AS mtd WHERE mtd.store_id = current_setting('app.current_store_id')::uuid AND mtd.manufacturer_id = manuf.id AND mtd.language_id = $2))) AS translated
     FROM manufacturer AS manuf WHERE store_id = current_setting('app.current_store_id')::uuid ORDER BY created_at ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-manufacturer-for-select',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public insert(...args: ManufacturerType[keyof ManufacturerType][]) {
    const text = `INSERT INTO manufacturer(store_id, link, media_id, created_by)
      VALUES(current_setting('app.current_store_id')::uuid, $1, $2, current_setting('app.current_user_id')::uuid) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public insertTranslation(
    ...args: ManufacturerType[keyof ManufacturerType][]
  ) {
    const text = `INSERT INTO manufacturer_transaction (store_id, manufacturer_id, language_id, name, description)
    VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3, $4)`;

    return {
      text,
      values: [...args],
    };
  }

  public update(...args: ManufacturerType[keyof ManufacturerType][]) {
    const text = `UPDATE manufacturer SET link = $2, media_id = $3, updated_by = current_setting('app.current_user_id')::uuid
              WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updateTranslation(
    ...args: ManufacturerType[keyof ManufacturerType][]
  ) {
    const text = `INSERT INTO manufacturer_transaction (store_id, manufacturer_id, language_id, name, description)
                  VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3, $4)
                  ON CONFLICT (store_id, manufacturer_id, language_id) DO UPDATE SET name = excluded.name, description = excluded.description`;

    return {
      text,
      values: [...args],
    };
  }

  public delete(id: number) {
    const text = `DELETE FROM manufacturer WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [id],
    };
  }
}
