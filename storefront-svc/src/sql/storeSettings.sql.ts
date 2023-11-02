import { StoreType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class StoreSettingsQueryString extends CommonQueryString {
  public checkAlias(alias: string) {
    const text = `SELECT exists (SELECT name FROM alias WHERE name = $1 LIMIT 1)`;
    return {
      text,
      values: [alias],
    };
  }

  public createAlias(name: string, domain: string | null) {
    const text = `INSERT INTO alias(name, domain) VALUES($1, $2) RETURNING name`;

    return {
      text,
      values: [name, domain],
    };
  }

  public CheckEmailExists() {
    const text = `SELECT exists (SELECT email FROM user_account WHERE email = current_setting('app.current_alias')::VARCHAR(255) LIMIT 1)`;

    return {
      text,
      values: [],
    };
  }

  public createStore(...args: StoreType[keyof StoreType][]) {
    const text = `INSERT INTO store(id, alias, tier, status) VALUES($1, $2, 'BASIC', 'active') RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }
}
