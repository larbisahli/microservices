import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class ShippingQueryString extends CommonQueryString {
  public getShippingZones() {
    const text = `SELECT ship.id, ship.name, ship.display_name AS "displayName", ship.active, ship.free_shipping AS "freeShipping",
          -- logo
          ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
          FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = ship.media_id )) AS logo,
          (SELECT json_build_object('id', dt.id, 'unit', jsonb_build_object('unit', unit), 'min', dt.min, 'max', dt.max)
          FROM delivery_time AS dt WHERE dt.store_id = current_setting('app.current_store_id')::uuid AND dt.id = ship.delivery_time_id) AS "deliveryTime",
          ship.rate_type AS "rateType" FROM shipping_zone AS ship
          WHERE ship.store_id = current_setting('app.current_store_id')::uuid`;

    return {
      name: 'get-store-shipping-zones',
      text,
      values: [],
    };
  }

  public getZones(id: number) {
    const text = `SELECT id AS "zoneId", country->>'id' as id, country->>'name' as name, country->>'iso2' as iso2
                  FROM shipping_country_zone WHERE store_id = current_setting('app.current_store_id')::uuid AND shipping_zone_id = $1`;

    return {
      name: 'get-store-zones',
      text,
      values: [id],
    };
  }

  public getShippingRates(id: number) {
    const text = `SELECT distinct rate.id, jsonb_build_object('unit', rate.weight_unit) AS "weightUnit", rate.min::INTEGER,
                  rate.max::INTEGER, rate.no_max AS "noMax", rate.price::INTEGER FROM shipping_rate AS rate
                  WHERE rate.store_id = current_setting('app.current_store_id')::uuid AND rate.shipping_zone_id = $1`;

    return {
      name: 'get-store-shipping-rates',
      text,
      values: [id],
    };
  }
}
