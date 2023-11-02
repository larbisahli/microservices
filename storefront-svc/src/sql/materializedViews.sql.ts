// A materialized view is a precomputed table that stores the result of a query.
// It can be used to speed up queries that require expensive computations.
/**
 * Note: we cannot use session variables directly as parameters inside a materialized view query in PostgreSQL.
 * Materialized views are precomputed queries that are stored as physical tables.
 * They don't have access to session variables because they don't depend on the current session state.
 */
import { Service } from 'typedi';

@Service()
export default class MaterializedViews {
  public createMenuView() {
    const text = `--sql CREATE MATERIALIZED VIEW store_menu AS SELECT * FROM get_store_menu126('f90636fe-f0ab-41d0-a27b-472440003ff8')`;

    return {
      text,
      values: [],
    };
  }

  public refreshMenuView() {
    const text = `--sql REFRESH MATERIALIZED VIEW store_menu`;

    return {
      text,
      values: [],
    };
  }
}
