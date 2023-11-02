import type { RoleInterfaceType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class RoleQueryString extends CommonQueryString {
  public createDefaultRoleForTenant(
    ...args: RoleInterfaceType[keyof RoleInterfaceType][]
  ) {
    const text = `INSERT INTO acl_user_role (store_id, name, description, privileges) VALUES (current_setting('app.current_store_id')::uuid,
    $1, 'Administrator has full access to this store',$2) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public getUserRoleForAuth(id: number) {
    const text = `SELECT id, name, privileges FROM acl_user_role WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public getRoles() {
    const text = `SELECT id, name FROM acl_user_role WHERE store_id = current_setting('app.current_store_id')::uuid`;

    return {
      text,
      values: [],
    };
  }

  public insert(...args: RoleInterfaceType[keyof RoleInterfaceType][]) {
    const text = `INSERT INTO acl_user_role(store_id, name, privileges) VALUES(current_setting('app.current_store_id')::uuid, $1, $2) RETURNING name`;

    return {
      text,
      values: [...args],
    };
  }
}
