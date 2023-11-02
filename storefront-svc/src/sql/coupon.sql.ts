import { CouponType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class CouponQueryString extends CommonQueryString {
  // **** ADMIN QUERIES ****
  public getCoupon(id: number) {
    const text = `SELECT cop.id, cop.code, cop.order_amount_limit AS "orderAmountLimit",
                  cop.discount_value AS "discountValue", cop.discount_type AS "discountType",
                  cop.times_used AS "timesUsed", cop.max_usage AS "maxUsage", cop.coupon_start_date AS "couponStartDate",
                  cop.coupon_end_date AS "couponEndDate", cop.created_at AS "createAt", cop.updated_at AS "updatedAt"
                  FROM coupon AS cop WHERE cop.store_id = current_setting('app.current_store_id')::uuid AND cop.id = $1`;

    return {
      name: 'get-coupon',
      text,
      values: [id],
    };
  }

  public getCoupons(limit: number, offset: number) {
    const text = `SELECT cop.id, cop.code, cop.order_amount_limit AS "orderAmountLimit", cop.discount_value AS "discountValue", cop.discount_type AS "discountType",
          cop.times_used AS "timesUsed", cop.max_usage AS "maxUsage", cop.coupon_start_date AS "couponStartDate", cop.coupon_end_date AS "couponEndDate", cop.created_at AS "createAt", cop.updated_at AS "updatedAt",
          -- Created/Updated by
          (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = cop.created_by) AS "createdBy",
          (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = cop.updated_by) AS "updatedBy"
          FROM coupon AS cop WHERE cop.store_id = current_setting('app.current_store_id')::uuid ORDER BY cop.created_at ASC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-coupons',
      text,
      values: [limit, offset],
    };
  }

  public insert(...args: CouponType[keyof CouponType][]) {
    const text = `INSERT INTO coupon(store_id, code, order_amount_limit, discount_value, discount_type,
                max_usage, coupon_start_date, coupon_end_date, created_by)
                VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5,
                to_timestamp($6, 'YYYY-MM-DD HH24:MI:SS'), to_timestamp($7, 'YYYY-MM-DD HH24:MI:SS'),
                current_setting('app.current_user_id')::uuid) RETURNING id, code`;

    return {
      text,
      values: [...args],
    };
  }

  public update(...args: CouponType[keyof CouponType][]) {
    const text = `UPDATE coupon SET code = $2, order_amount_limit= $3, discount_value = $4,
              discount_type = $5, max_usage = $6, coupon_start_date = to_timestamp($7, 'YYYY-MM-DD HH24:MI:SS'),
              coupon_end_date = to_timestamp($8, 'YYYY-MM-DD HH24:MI:SS'), updated_by = current_setting('app.current_user_id')::uuid
              WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id, code`;

    return {
      text,
      values: [...args],
    };
  }

  public delete(id: number) {
    const text = `DELETE FROM coupon WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id, code`;

    return {
      text,
      values: [id],
    };
  }
}
