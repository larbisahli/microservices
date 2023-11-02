import {
  CountryType,
  ShippingRateType,
  ShippingZoneType,
} from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class ShippingQueryString extends CommonQueryString {
  public getShippingZone(languageId: number, id: number) {
    const text = `SELECT ship.id, ship.name, ship.display_name AS "displayName", ship.active, ship.free_shipping AS "freeShipping",
          -- logo
          ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
          FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = ship.media_id )) AS logo,
          (SELECT json_build_object(
            'id', dt.id,
            'name', (SELECT dtt.name FROM delivery_time_transaction AS dtt WHERE dtt.store_id = current_setting('app.current_store_id')::uuid AND dtt.delivery_time_id = dt.id AND dtt.language_id = $1)
            ) FROM delivery_time AS dt WHERE dt.store_id = current_setting('app.current_store_id')::uuid AND dt.id = ship.delivery_time_id ) AS "deliveryTime",
          ship.rate_type AS "rateType" FROM shipping_zone AS ship
          WHERE ship.store_id = current_setting('app.current_store_id')::uuid AND ship.id = $2`;

    return {
      name: 'get-shipping-zone',
      text,
      values: [languageId, id],
    };
  }

  public getZones(id: number) {
    const text = `SELECT id AS "zoneId", country->>'id' as id, country->>'name' as name, country->>'iso2' as iso2
                  FROM shipping_country_zone WHERE store_id = current_setting('app.current_store_id')::uuid AND shipping_zone_id = $1`;

    return {
      name: 'get-zones',
      text,
      values: [id],
    };
  }

  public getShippingRates(id: number) {
    const text = `SELECT distinct rate.id, jsonb_build_object('unit', rate.weight_unit) AS "weightUnit", rate.min,
                  rate.max, rate.no_max AS "noMax", rate.price FROM shipping_rate AS rate
                  WHERE rate.store_id = current_setting('app.current_store_id')::uuid AND rate.shipping_zone_id = $1`;

    return {
      name: 'get-shipping-rates',
      text,
      values: [id],
    };
  }

  public getShippingZones(limit: number, offset: number) {
    const text = `SELECT ship.id, ship.name, ship.active, ship.free_shipping AS "freeShipping",
                  ship.rate_type AS "rateType", ship.created_at AS "createdAt", ship.updated_at AS "updatedAt",
                  -- logo
          ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
          FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = ship.media_id )) AS logo,
          -- Created/Updated by
          (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
          WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = ship.created_by) AS "createdBy",
          (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
          WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = ship.updated_by) AS "updatedBy"
          FROM shipping_zone AS ship WHERE ship.store_id = current_setting('app.current_store_id')::uuid ORDER BY ship.created_at ASC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-shipping-zones',
      text,
      values: [limit, offset],
    };
  }

  public insertShippingZone(
    ...args: ShippingZoneType[keyof ShippingZoneType][]
  ) {
    const text = `INSERT INTO shipping_zone(store_id, name, display_name, active, free_shipping, rate_type, media_id, delivery_time_id, created_by)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7, current_setting('app.current_user_id')::uuid) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updateShippingZone(
    ...args: ShippingZoneType[keyof ShippingZoneType][]
  ) {
    const text = `UPDATE shipping_zone SET name = $2, display_name = $3, active = $4, free_shipping = $5, rate_type = $6, media_id = $7, delivery_time_id = $8,
                  updated_by = current_setting('app.current_user_id')::uuid WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updateShippingZoneUpdatedBy(id: number) {
    const text = `UPDATE shipping_zone SET updated_by = current_setting('app.current_user_id')::uuid WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public insertShippingCountryZone(...args: (number | CountryType)[]) {
    const text = `INSERT INTO shipping_country_zone(store_id, shipping_zone_id, country)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public insertShippingRate(
    ...args: ShippingRateType[keyof ShippingRateType][]
  ) {
    const text = `INSERT INTO shipping_rate(store_id, shipping_zone_id, weight_unit, min, max, no_max, price)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6)`;

    return {
      text,
      values: [...args],
    };
  }

  public updateShippingRate(
    ...args: ShippingRateType[keyof ShippingRateType][]
  ) {
    const text = `UPDATE shipping_rate SET weight_unit = $2, min = $3, max = $4, no_max = $5, price = $6
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteShippingZone(id: number) {
    const text = `DELETE FROM shipping_zone WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [id],
    };
  }

  public deleteShippingCountryZone(id: number) {
    const text = `DELETE FROM shipping_country_zone WHERE store_id = current_setting('app.current_store_id')::uuid AND shipping_zone_id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public deleteShippingCountryZoneBy2(...args: number[]) {
    const text = `DELETE FROM shipping_country_zone WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 AND shipping_zone_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteShippingRate(id: number) {
    const text = `DELETE FROM shipping_rate WHERE store_id = current_setting('app.current_store_id')::uuid AND shipping_zone_id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public deleteShippingRateById(id: number) {
    const text = `DELETE FROM shipping_rate WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }
}
