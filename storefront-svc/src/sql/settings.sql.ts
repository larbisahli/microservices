import { CurrencyType, SettingsType } from '@ts-types/interfaces';
import { Service } from 'typedi';

@Service()
export default class SettingsQueryString {
  public getStoreSettings() {
    const text = `SELECT ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = logo_media_id )) AS logo,
    (SELECT alias from store AS st WHERE st.id = current_setting('app.current_store_id')::uuid) AS alias,
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = favicon_media_id )) AS favicon,
    ARRAY((SELECT json_build_object('id', lang.id, 'name', lang.name, 'localeId', lang.locale_id, 'isDefault', lang.is_default)
    FROM store_language AS lang WHERE lang.store_id = current_setting('app.current_store_id')::uuid AND lang.active is TRUE )) AS locales,
    currencies, default_currency AS "defaultCurrency", google, store_name AS "storeName", store_email AS "storeEmail",
    store_number AS "storeNumber", address_line1 AS "addressLine1", address_line2 AS "addressLine2",
    max_checkout_quantity AS "maxCheckoutQuantity", max_checkout_amount AS "maxCheckoutAmount", store_id AS "storeId",
    (SELECT json_build_object('name', tax.name, 'rate', tax.rate, 'countries', tax.countries) FROM store_tax AS tax WHERE tax.store_id = current_setting('app.current_store_id')::uuid AND tax.id = tax_id) as tax,
    (SELECT json_build_object(
    'metaTitle', meta_title, 'metaDescription', meta_description,
    'metaTags', meta_tags, 'ogTitle', og_title,
    'ogDescription', og_description, 'ogImage', ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = og_media_id )),
    'twitterHandle', twitter_handle)) AS "seo", store_template_id AS "templateId" FROM store_settings WHERE store_id = current_setting('app.current_store_id')::uuid`;

    return {
      name: 'get-settings',
      text,
      values: [],
    };
  }

  public getStorTaxRate() {
    const text = `SELECT rate, countries FROM store_tax WHERE store_id = current_setting('app.current_store_id')::uuid AND id = (SELECT ss.tax_id FROM store_settings AS ss WHERE ss.store_id = current_setting('app.current_store_id')::uuid)`;

    return {
      name: 'get-store-tax-rate',
      text,
      values: [],
    };
  }

  public getStoreSystemCurrency() {
    const text = `SELECT system_currency AS "systemCurrency" FROM store_settings WHERE store_id = current_setting('app.current_store_id')::uuid`;

    return {
      name: 'get-store-system-currency',
      text,
      values: [],
    };
  }

  public getStoreAdminConfig() {
    const text = `SELECT system_currency AS "systemCurrency", store_name AS "storeName", store_email AS "storeEmail", store_number AS "storeNumber",
    ARRAY((SELECT json_build_object('id', lang.id, 'name', lang.name, 'localeId', lang.locale_id, 'isDefault', lang.is_default, 'isSystem', lang.is_system)
    FROM store_language AS lang WHERE lang.store_id = current_setting('app.current_store_id')::uuid)) AS "languages" FROM store_settings
    WHERE store_id = current_setting('app.current_store_id')::uuid`;

    return {
      name: 'get-store-admin-config',
      text,
      values: [],
    };
  }

  public getStoreSettingsFavicon() {
    const text = `SELECT ARRAY((SELECT json_build_object('id', favicon_media_id))) AS favicon, store_name AS "storeName",
    (SELECT json_build_object('metaDescription', meta_description)) AS "seo" FROM store_settings WHERE store_id = current_setting('app.current_store_id')::uuid`;

    return {
      name: 'get-settings-favicon',
      text,
      values: [],
    };
  }

  public getImageById(id: string) {
    const text = `SELECT id, image_path AS image, placeholder_path AS placeholder FROM media WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-photo-by-id',
      text,
      values: [id],
    };
  }
}
