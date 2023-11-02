import { TableNames } from '@ts-types/constants';
import Container, { Service } from 'typedi';

@Service()
export default class CommonQueryString {
  public getTableCount(tableName: TableNames) {
    const text = `SELECT row_count::integer as count FROM table_stats
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND table_name = $1`;

    return {
      text,
      values: [tableName],
    };
  }

  /**
   * TRUE value here in set_config means that the setting should be local to the current transaction or session.
   * Since all of our database operations are inside a transaction for security reasons aka RLS
   */
  public setSessionAlias(alias: string) {
    const text = `SELECT set_config('app.current_alias', $1, TRUE)`;
    return {
      name: 'app_current_alias',
      text,
      values: [alias],
    };
  }

  public setSessionEmail(email: string) {
    const text = `SELECT set_config('app.current_user_email', $1, TRUE)`;
    return {
      name: 'app_current_user_email',
      text,
      values: [email],
    };
  }

  public setSessionStoreId(id: string) {
    const text = `SELECT set_config('app.current_store_id', $1, TRUE)`;
    return {
      name: 'app_current_store_id',
      text,
      values: [id],
    };
  }

  public setSessionUserId(id: string) {
    const text = `SELECT set_config('app.current_user_id', $1, TRUE)`;
    return {
      name: 'app_current_user_id',
      text,
      values: [id],
    };
  }

  public getStoreIdByAlias() {
    const text = `SELECT id FROM store WHERE alias = current_setting('app.current_alias')::VARCHAR(63)`;
    return {
      name: 'get-store-id-by-alias',
      text,
      values: [],
    };
  }

  public getAliasByStoreId() {
    const text = `SELECT alias FROM store WHERE id = current_setting('app.current_store_id')::UUID`;
    return {
      name: 'get-alias-by-store-id',
      text,
      values: [],
    };
  }
}

const {
  setSessionAlias,
  setSessionStoreId,
  setSessionUserId,
  getStoreIdByAlias,
  setSessionEmail,
} = Container.get(CommonQueryString);

export {
  setSessionAlias,
  setSessionStoreId,
  setSessionUserId,
  getStoreIdByAlias,
  setSessionEmail,
};
