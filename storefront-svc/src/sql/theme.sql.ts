import { ThemeType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class ThemeQueryString extends CommonQueryString {
  public checkStoreTheme(id: string) {
    const text = `SELECT exists (SELECT id FROM store_theme WHERE store_id = current_setting('app.current_store_id')::uuid AND theme_id = $1 LIMIT 1)`;

    return {
      name: 'check-store-theme',
      text,
      values: [id],
    };
  }

  public getThemes() {
    const text = `SELECT id, title, theme_path AS "themePath",
    description, preview_image AS "previewImage", reviews_count AS "reviewsCount", rating_star_count AS "ratingStarCount",
    price, is_free AS "isFree", version, updated_at AS "updatedAt" FROM theme`;

    return {
      name: 'get-themes',
      text,
      values: [],
    };
  }

  public getTheme(id: string) {
    const text = `SELECT id, title, theme_path AS "themePath",
    description, preview_image AS "previewImage", reviews_count AS "reviewsCount", rating_star_count AS "ratingStarCount",
    price, is_free AS "isFree", version, updated_at AS "updatedAt" FROM theme WHERE id = $1`;

    return {
      name: 'get-theme',
      text,
      values: [id],
    };
  }

  public insertStoreTheme(...args: ThemeType[keyof ThemeType][]) {
    const text = `INSERT INTO store_theme(store_id, theme_id, is_default)
    VALUES(current_setting('app.current_store_id')::uuid, $1, FALSE) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updateStoreThemeDefault(...args: ThemeType[keyof ThemeType][]) {
    const text = `UPDATE store_theme SET theme_id = $1, is_default = TRUE WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $2 RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public getStoreThemes() {
    const text = `SELECT ARRAY((SELECT json_build_object('id', theme.id, 'title', theme.title, 'themePath', theme.theme_path,
    'description', theme.description, 'previewImage', theme.preview_image, 'reviewsCount', theme.reviews_count,
    'ratingStarCount', theme.rating_star_count, 'isDefault', st.is_default, 'version', theme.version)
    FROM theme AS theme WHERE theme.id = st.theme_id )) AS themes FROM store_theme AS st WHERE store_id = current_setting('app.current_store_id')::uuid ORDER BY is_default`;

    return {
      name: 'get-store-themes',
      text,
      values: [],
    };
  }

  public createDefaultStoreTheme(...args: ThemeType[keyof ThemeType][]) {
    const text = `INSERT INTO store_theme(store_id, theme_id, is_default)
    VALUES(current_setting('app.current_store_id')::uuid, 'b835b676-0229-4506-8940-e7881a7578f6', TRUE)`;

    return {
      text,
      values: [...args],
    };
  }
}
