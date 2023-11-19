import { CurrencyType, SettingsType } from '@ts-types/interfaces';
import { Service } from 'typedi';

@Service()
export default class SettingsQueryString {
  public getStoreSettings() {
    const text = `SELECT ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = logo_media_id )) AS logo,
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = favicon_media_id )) AS favicon,
    ARRAY((SELECT json_build_object('id', lang.id, 'name', lang.name, 'localeId', lang.locale_id, 'iso2', lang.iso2, 'isDefault', lang.is_default) FROM store_language AS lang WHERE lang.store_id = current_setting('app.current_store_id')::uuid AND lang.active is TRUE )) AS locales,
    currencies, socials, google, store_name AS "storeName", store_email AS "storeEmail",
    store_number AS "storeNumber", address_line1 AS "addressLine1", address_line2 AS "addressLine2",
    max_checkout_quantity AS "maxCheckoutQuantity", max_checkout_amount AS "maxCheckoutAmount",
    (SELECT json_build_object(
    'metaTitle', meta_title, 'metaDescription', meta_description,
    'metaTags', meta_tags, 'ogTitle', og_title,
    'ogDescription', og_description, 'ogImage', ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
    FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = og_media_id )),
    'twitterHandle', twitter_handle)) AS "seo" FROM store_settings WHERE store_id = current_setting('app.current_store_id')::uuid`;

    return {
      name: 'get-settings',
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

  public updateStoreSettings(...args: SettingsType[keyof SettingsType][]) {
    const text = `UPDATE store_settings SET logo_media_id = $1, favicon_media_id = $2, currencies = $3,
    meta_title = $4, meta_description = $5, meta_tags = $6, og_title = $7,
    og_description = $8, og_media_id = $9, twitter_handle = $10, socials = $11::JSON, max_checkout_quantity = $12,
    store_email = $13, store_name = $14, store_number = $15, google = $16, address_line1 = $17,
    address_line2 = $18, max_checkout_amount = $19 WHERE store_id = current_setting('app.current_store_id')::uuid RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public setDefaultSettings(
    phoneNumber: string,
    email: string,
    storeName: string,
    currencies: string,
    systemCurrency: CurrencyType
  ) {
    const text = `INSERT INTO store_settings (
      store_id, store_number, store_email, store_name, tax,
      max_checkout_quantity, max_checkout_amount, currencies, system_currency, socials
      )
    VALUES (
      current_setting('app.current_store_id')::uuid,
      $1, $2, $3, 0, 10, 9999, $4, $5,
      '[
      {
        "url": "https://www.facebook.com/",
        "icon": {"value": "FacebookIcon"}
      },
      {
        "url": "https://twitter.com/",
        "icon": {"value": "TwitterIcon"}
      },
      {
        "url": "https://www.instagram.com/",
        "icon": {"value": "InstagramIcon"}
      }
    ]')`;

    return {
      text,
      values: [phoneNumber, email, storeName, currencies, systemCurrency],
    };
  }
}
