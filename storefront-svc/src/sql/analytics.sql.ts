import { Service } from 'typedi';

/**
 * Create a prepared statement to avoid the overhead of parsing,
 * analyzing and planning a SQL statement each time it is executed.
 * When we have a prepared statement, the statement is parsed, planned, and optimized once and then cached in memory.
 */
@Service()
export default class AnalyticsQueryString {
  public createTableStatsDefaults() {
    const text = `INSERT INTO table_stats (table_name, store_id, row_count) VALUES
    ('attribute', current_setting('app.current_store_id')::uuid, 0),
    ('manufacturer', current_setting('app.current_store_id')::uuid, 0),
    ('category', current_setting('app.current_store_id')::uuid, 0),
    ('tag', current_setting('app.current_store_id')::uuid, 0),
    ('order_status', current_setting('app.current_store_id')::uuid, 0),
    ('media_folder', current_setting('app.current_store_id')::uuid, 0),
    ('user_account', current_setting('app.current_store_id')::uuid, 1),
    ('supplier', current_setting('app.current_store_id')::uuid, 0),
    ('product', current_setting('app.current_store_id')::uuid, 0),
    ('customer', current_setting('app.current_store_id')::uuid, 0),
    ('coupon', current_setting('app.current_store_id')::uuid, 0),
    ('shipping_zone', current_setting('app.current_store_id')::uuid, 0),
    ('delivery_time', current_setting('app.current_store_id')::uuid, 0),
    ('order', current_setting('app.current_store_id')::uuid, 0),
    ('sell', current_setting('app.current_store_id')::uuid, 0),
    ('hero_slider', current_setting('app.current_store_id')::uuid, 0),
    ('notification', current_setting('app.current_store_id')::uuid, 0),
    ('store_language', current_setting('app.current_store_id')::uuid, 0),
    ('cart', current_setting('app.current_store_id')::uuid, 0);
    `;

    return {
      text,
      values: [],
    };
  }
}
