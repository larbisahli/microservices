import { SuppliersType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class SupplierQueryString extends CommonQueryString {
  public getSupplier(id: number) {
    const text = `SELECT sup.id, sup.name, sup.company, sup.phone_number AS "phoneNumber",
                  sup.address_line1 AS "addressLine1", sup.address_line2 AS "addressLine2", sup.city, sup.note, sup.country
                  FROM supplier AS sup WHERE sup.store_id = current_setting('app.current_store_id')::uuid AND sup.id = $1`;

    return {
      name: 'get-supplier',
      text,
      values: [id],
    };
  }

  public getSuppliers(limit: number, offset: number) {
    const text = `SELECT sup.id, sup.name, sup.company, sup.phone_number AS "phoneNumber", sup.address_line1 AS "addressLine1", sup.created_at AS "createdAt", sup.country,
                    -- Created/Updated by
                  (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
                  WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = sup.created_by) AS "createdBy",
                  (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
                  WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = sup.updated_by) AS "updatedBy"
                  FROM supplier AS sup WHERE sup.store_id = current_setting('app.current_store_id')::uuid ORDER BY sup.created_at ASC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-suppliers',
      text,
      values: [limit, offset],
    };
  }

  public getSuppliersForSelect(limit: number, offset: number) {
    const text = `SELECT id, name FROM supplier WHERE store_id = current_setting('app.current_store_id')::uuid ORDER BY created_at ASC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-suppliers-for-select',
      text,
      values: [limit, offset],
    };
  }

  public insert(...args: SuppliersType[keyof SuppliersType][]) {
    const text = `INSERT INTO supplier(store_id, name, company, phone_number, address_line1, address_line2, country, city, note, created_by)
      VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7, $8, current_setting('app.current_user_id')::uuid) RETURNING name`;

    return {
      text,
      values: [...args],
    };
  }

  public update(...args: SuppliersType[keyof SuppliersType][]) {
    const text = `UPDATE supplier SET name = $2, company = $3, phone_number = $4,
              address_line1 = $5, address_line2 = $6, country = $7, city = $8, note = $9,
              updated_by = current_setting('app.current_user_id')::uuid WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1
              RETURNING name`;

    return {
      text,
      values: [...args],
    };
  }

  public delete(id: number) {
    const text = `DELETE FROM supplier WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING name`;

    return {
      text,
      values: [id],
    };
  }
}
