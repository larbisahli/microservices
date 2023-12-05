import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class LanguageQueryString extends CommonQueryString {
  public getLanguage(id: number) {
    const text = `SELECT id, name, locale_id AS "localeId", direction,
    translation FROM store_language WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-store-language',
      text,
      values: [id],
    };
  }
}
