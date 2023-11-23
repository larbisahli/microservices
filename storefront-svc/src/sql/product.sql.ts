import {
  ImageType,
  ProductShippingInfo,
  ProductType,
  ProductVariationOptions,
} from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class ProductQueryString extends CommonQueryString {
  public getProductGallery(id: number, is_thumbnail: boolean) {
    const text = `SELECT id ,image_path as "image", placeholder_path as "placeholder" FROM media
                 WHERE store_id = current_setting('app.current_store_id')::uuid AND id IN
                 (SELECT media_id FROM product_media AS gal WHERE gal.store_id = current_setting('app.current_store_id')::uuid
                 AND gal.product_id = $1 AND gal.is_thumbnail = $2)`;

    return {
      name: 'get-product-gallery',
      text,
      values: [id, is_thumbnail],
    };
  }

  public getProductContent(id: number) {
    const text = `SELECT pd.id ,pd.sale_price AS "salePrice", pd.buying_price
    AS "buyingPrice", pd.compare_price AS "comparePrice", pd.slug,
            pd.disable_out_of_stock AS "disableOutOfStock", pd.quantity, pd.published,
            pd.created_at AS "createdAt", pd.updated_at AS "updatedAt", pd.sku,
            ARRAY(SELECT json_build_object('id', photo.id ,'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
            photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = pd.og_media_id) AS "metaImage",
            jsonb_build_object('id', pd.type) AS "type" FROM product AS pd
            WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.id = $1`;

    return {
      name: 'get-product-content',
      text,
      values: [id],
    };
  }

  public getProductShippingInfo(id: number) {
    const text = `SELECT id, weight::INTEGER, json_build_object('unit', weight_unit) AS "weightUnit",
            dimension_width::INTEGER AS "dimensionWidth", dimension_height::INTEGER AS "dimensionHeight", dimension_depth::INTEGER
            AS "dimensionLength", json_build_object('unit', dimension_unit) AS "dimensionUnit"
            FROM product_shipping_info WHERE store_id = current_setting('app.current_store_id')::uuid AND product_id = $1`;

    return {
      name: 'get-product-shipping-info',
      text,
      values: [id],
    };
  }

  public getProductCategories(
    languageId: number,
    defaultLanguageId: number,
    id: number
  ) {
    const text = `SELECT cate.id,
            -- translation
            (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate.id AND language_id = $1),
            (SELECT json_build_object(
              'name', (SELECT name FROM category_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND category_id = cate.id AND language_id = $2))) AS translated
            FROM category AS cate WHERE store_id = current_setting('app.current_store_id')::uuid
            AND id IN (SELECT pc.category_id FROM product_category pc
            WHERE pc.store_id = current_setting('app.current_store_id')::uuid AND pc.product_id = $3)`;

    return {
      name: 'get-product-categories',
      text,
      values: [languageId, defaultLanguageId, id],
    };
  }

  public getStoreProductCategories(id: number) {
    const text = `SELECT cate.id, cate.name,
            (SELECT json_build_object('breadcrumbsPriority', seo.breadcrumbs_priority, 'urlKey', seo.url_key) FROM category_seo seo WHERE seo.store_id = current_setting('app.current_store_id')::uuid AND seo.category_id = cate.id) as "categorySeo"
            FROM category cate WHERE cate.store_id = current_setting('app.current_store_id')::uuid AND cate.id IN (SELECT pc.category_id FROM product_category pc
            WHERE pc.store_id = current_setting('app.current_store_id')::uuid AND pc.product_id = $1)`;

    return {
      name: 'get-store-product-categories',
      text,
      values: [id],
    };
  }

  public getProductTags(
    languageId: number,
    defaultLanguageId: number,
    id: number
  ) {
    const text = `SELECT tg.id,
    -- Translation
    (SELECT ttl.name FROM tag_translation AS ttl WHERE ttl.store_id = current_setting('app.current_store_id')::uuid AND ttl.tag_id = tg.id AND ttl.language_id = $1),
    (SELECT json_build_object('name', (SELECT ttd.name FROM tag_translation AS ttd WHERE ttd.store_id = current_setting('app.current_store_id')::uuid AND ttd.tag_id = tg.id AND ttd.language_id = $2))) AS translated
    FROM tag AS tg WHERE store_id = current_setting('app.current_store_id')::uuid
    AND id IN (SELECT pt.tag_id FROM product_tag pt WHERE pt.store_id = current_setting('app.current_store_id')::uuid AND pt.product_id = $3)`;

    return {
      name: 'get-product-tags',
      text,
      values: [languageId, defaultLanguageId, id],
    };
  }

  public getProductSuppliers(id: number) {
    const text = `SELECT id, name FROM supplier WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND id IN (SELECT ps.supplier_id FROM product_supplier ps WHERE ps.store_id = current_setting('app.current_store_id')::uuid
                  AND ps.product_id = $1)`;

    return {
      name: 'get-product-suppliers',
      text,
      values: [id],
    };
  }

  public getProductManufacturers(
    languageId: number,
    defaultLanguageId: number,
    id: number
  ) {
    const text = `SELECT manuf.id,
    -- Translation
    (SELECT mtl.name FROM manufacturer_transaction AS mtl WHERE mtl.store_id = current_setting('app.current_store_id')::uuid  AND mtl.manufacturer_id = manuf.id AND mtl.language_id = $1),
    (SELECT json_build_object('name', (SELECT mtd.name FROM manufacturer_transaction AS mtd WHERE mtd.store_id = current_setting('app.current_store_id')::uuid AND mtd.manufacturer_id = manuf.id AND mtd.language_id = $2))) AS translated
    FROM manufacturer AS manuf WHERE store_id = current_setting('app.current_store_id')::uuid
    AND id IN (SELECT manuf.manufacturer_id FROM product_manufacturer manuf WHERE manuf.store_id = current_setting('app.current_store_id')::uuid AND manuf.product_id = $3)`;

    return {
      name: 'get-product-manufacturers',
      text,
      values: [languageId, defaultLanguageId, id],
    };
  }

  public getProductVariationOptions(id: number) {
    const text = `SELECT vo.id, vo.sku, vo.title, ARRAY(SELECT json_build_object('id', photo_v.id, 'image', photo_v.image_path, 'placeholder', photo_v.placeholder_path)
                  FROM media AS photo_v WHERE photo_v.store_id = current_setting('app.current_store_id')::uuid AND photo_v.id = vo.media_id) AS "thumbnail",
                  vo.sale_price AS "salePrice", vo.compare_price AS "comparePrice", vo.buying_price AS "buyingPrice", vo.quantity, vo.sku, NOT(vo.active) AS "isDisable",
                  ARRAY(SELECT pav.attribute_value_id FROM product_attribute_value pav WHERE pav.store_id = current_setting('app.current_store_id')::uuid AND pav.id IN
                  (SELECT vv.product_attribute_value_id FROM variant_value vv WHERE vv.store_id = current_setting('app.current_store_id')::uuid AND vv.variant_id =
                  (SELECT v.id FROM variant v WHERE v.store_id = current_setting('app.current_store_id')::uuid AND v.variant_option_id = vo.id)) ORDER BY pav.attribute_value_id ASC) AS "options"
                  FROM variant_option vo WHERE vo.store_id = current_setting('app.current_store_id')::uuid AND vo.id IN
                  (SELECT v.variant_option_id FROM variant v WHERE v.store_id = current_setting('app.current_store_id')::uuid AND v.product_id = $1) ORDER BY vo.title`;

    return {
      name: 'get-product-variation-options',
      text,
      values: [id],
    };
  }

  public getProductVariationForStore(id: number) {
    const text = `SELECT json_build_object('id', pa.attribute_id, 'name', (SELECT att.attribute_name FROM attribute att
                  WHERE att.store_id = current_setting('app.current_store_id')::uuid AND att.id = pa.attribute_id)) AS "attribute",
                  ARRAY(SELECT json_build_object('id', pav.attribute_value_id,
                  'value', (SELECT att_v.attribute_value FROM attribute_value att_v WHERE att_v.store_id = current_setting('app.current_store_id')::uuid AND att_v.id = pav.attribute_value_id),
                  'color', (SELECT att_v.color FROM attribute_value att_v WHERE att_v.store_id = current_setting('app.current_store_id')::uuid AND att_v.id = pav.attribute_value_id)
                  ) FROM product_attribute_value pav WHERE pav.store_id = current_setting('app.current_store_id')::uuid
                  AND pav.product_attribute_id = pa.id) AS "values"
                  FROM product_attribute pa WHERE pa.store_id = current_setting('app.current_store_id')::uuid AND pa.product_id = $1`;

    return {
      name: 'get-product-store-variation',
      text,
      values: [id],
    };
  }

  public getProductVariationForAdmin(
    languageId: number,
    defaultLanguageId: number,
    id: number
  ) {
    const text = `SELECT json_build_object(
              'id', pa.attribute_id,
              'name', (SELECT atl.name FROM attribute_translation AS atl WHERE atl.store_id = current_setting('app.current_store_id')::uuid AND atl.language_id = $1 AND atl.attribute_id = pa.attribute_id),
              'translated', (SELECT json_build_object(
                'name', (SELECT json_build_object(
                  'name', (SELECT atd.name FROM attribute_translation AS atd WHERE atd.store_id = current_setting('app.current_store_id')::uuid AND atd.language_id = $2 AND atd.attribute_id = pa.attribute_id)))))
              ) AS "attribute",
              ARRAY(SELECT json_build_object(
                'id', pav.attribute_value_id,
                'value', (SELECT atv.value FROM attribute_value_translation AS atv WHERE atv.store_id = current_setting('app.current_store_id')::uuid AND atv.language_id = $1 AND atv.attribute_value_id = pav.attribute_value_id),
                'translated', (SELECT json_build_object(
                  'value',  (SELECT atv_d2.value FROM attribute_value_translation AS atv_d2 WHERE atv_d2.store_id = current_setting('app.current_store_id')::uuid AND atv_d2.language_id = $2 AND atv_d2.attribute_value_id = pav.attribute_value_id)))
                ) FROM product_attribute_value pav WHERE pav.store_id = current_setting('app.current_store_id')::uuid
              AND pav.product_attribute_id = pa.id) AS "selectedValues"
              FROM product_attribute pa WHERE pa.store_id = current_setting('app.current_store_id')::uuid AND pa.product_id = $3`;

    return {
      name: 'get-product-admin-variation',
      text,
      values: [languageId, defaultLanguageId, id],
    };
  }

  public getProductTranslation(languageId: number, id: number) {
    const text = `SELECT name, description, meta_title AS "metaTitle", meta_keywords AS "metaKeywords", meta_description AS "metaDescription", note
                  FROM product_transaction WHERE store_id = current_setting('app.current_store_id')::uuid AND product_id = $1 AND language_id = $2`;

    return {
      name: 'get-product-translation',
      text,
      values: [id, languageId],
    };
  }

  public getProductRelatedProducts(
    language: number,
    defaultLanguageId: number,
    id: number
  ) {
    const text = `SELECT pd.id, pd.sku, jsonb_build_object('id', pd.type) AS type, pd.published,
                  -- Translation
                  (SELECT ptt.name FROM product_transaction AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
                  (SELECT json_build_object('name', (SELECT pttd.name FROM product_transaction AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
                  AND pttd.product_id = pd.id AND pttd.language_id = $2))) AS translated,
                  -- Quantity
                  CASE
                    WHEN pd.type = 'simple' THEN pd.quantity
                    WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
                    FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",
                  -- Thumbnail
                  ARRAY((SELECT json_build_object('id', photo.id ,'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
                  photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
                  WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail
                  FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.id IN
                  (SELECT related_product_id FROM related_product rp WHERE rp.store_id = current_setting('app.current_store_id')::uuid AND rp.product_id = $3)`;

    return {
      name: 'get-product-related-products',
      text,
      values: [language, defaultLanguageId, id],
    };
  }

  public getProductUpsellProducts(
    language: number,
    defaultLanguageId: number,
    id: number
  ) {
    const text = `SELECT pd.id, pd.sku, jsonb_build_object('id', pd.type) AS type, pd.published,
            -- Translation
            (SELECT ptt.name FROM product_transaction AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
            (SELECT json_build_object('name', (SELECT pttd.name FROM product_transaction AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
            AND pttd.product_id = pd.id AND pttd.language_id = $2))) AS translated,
            -- Quantity
            CASE
              WHEN pd.type = 'simple' THEN pd.quantity
              WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
              FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",
            -- Thumbnail
            ARRAY((SELECT json_build_object('id', photo.id ,'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
            photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
            WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail
            FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.id IN
            (SELECT upsell_product_id FROM upsell_product usp WHERE usp.store_id = current_setting('app.current_store_id')::uuid AND usp.product_id = $3)`;

    return {
      name: 'get-product-upsell-products',
      text,
      values: [language, defaultLanguageId, id],
    };
  }

  public getProductCrossSellProducts(
    language: number,
    defaultLanguageId: number,
    id: number
  ) {
    const text = `SELECT pd.id, pd.sku, jsonb_build_object('id', pd.type) AS type, pd.published,
                  -- Translation
                  (SELECT ptt.name FROM product_transaction AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
                  (SELECT json_build_object(
                    'name', (SELECT pttd.name FROM product_transaction AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
                  AND pttd.product_id = pd.id AND pttd.language_id = $2))) AS translated,
                  -- Quantity
                  CASE
                    WHEN pd.type = 'simple' THEN pd.quantity
                    WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
                    FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",
                  -- Thumbnail
                  ARRAY((SELECT json_build_object('id', photo.id ,'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
                  photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
                    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail
                  FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.id IN
                  (SELECT cross_sell_product_id FROM cross_sell_product csp WHERE csp.store_id = current_setting('app.current_store_id')::uuid AND csp.product_id = $3)`;

    return {
      name: 'get-product-cross-sell-products',
      text,
      values: [language, defaultLanguageId, id],
    };
  }

  public getProducts(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT pd.id, pd.sku, jsonb_build_object('id', pd.type) AS type, pd.published, pd.created_at AS "createdAt",

                -- Translation
                (SELECT ptt.name FROM product_transaction AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
                (SELECT json_build_object('name', (SELECT pttd.name FROM product_transaction AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
                AND pttd.product_id = pd.id AND pttd.language_id = $2))) AS translated,
                -- Quantity
                CASE
                  WHEN pd.type = 'simple' THEN pd.quantity
                  WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
                  FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",

                -- Price
                CASE WHEN pd.type = 'variable' THEN (SELECT MAX(vp.sale_price) FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "maxPrice",
                CASE WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price) FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "minPrice",
                CASE WHEN pd.type = 'simple' THEN pd.sale_price END AS "salePrice",

                -- Thumbnail
                ARRAY((SELECT json_build_object('id', photo.id ,'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
                photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
                WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail,

                -- Categories
                --ARRAY(SELECT json_build_object('id', cate.id, 'name', cate.name) FROM category cate WHERE
                --cate.store_id = current_setting('app.current_store_id')::uuid AND cate.id IN (SELECT pc.category_id FROM product_category pc
                --WHERE pc.store_id = current_setting('app.current_store_id')::uuid AND pc.product_id = pd.id)) AS categories,

                -- Created/Updated by
                (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
                WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = pd.created_by) AS "createdBy",
                (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
                WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = pd.updated_by) AS "updatedBy"
                FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid ORDER BY pd.created_at ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-products',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public getProductsNotId(
    languageId: number,
    defaultLanguageId: number,
    id: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT pd.id, pd.sku, jsonb_build_object('id', pd.type) AS type, pd.published, pd.created_at AS "createdAt",
                -- Translation
                (SELECT ptt.name FROM product_transaction AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
                (SELECT json_build_object('name', (SELECT pttd.name FROM product_transaction AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
                AND pttd.product_id = pd.id AND pttd.language_id = $2))) AS translated,

                -- Quantity
                CASE
                  WHEN pd.type = 'simple' THEN pd.quantity
                  WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
                  FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",

                -- Price
                CASE WHEN pd.type = 'variable' THEN (SELECT MAX(vp.sale_price) FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "maxPrice",
                CASE WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price) FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "minPrice",
                CASE WHEN pd.type = 'simple' THEN pd.sale_price END AS "salePrice",

                -- Thumbnail
                ARRAY((SELECT json_build_object('id', photo.id ,'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
                photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
                WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail,

                -- Categories
                --ARRAY(SELECT json_build_object('id', cate.id, 'name', cate.name) FROM category cate WHERE
                --cate.store_id = current_setting('app.current_store_id')::uuid AND cate.id IN (SELECT pc.category_id FROM product_category pc
                --WHERE pc.store_id = current_setting('app.current_store_id')::uuid AND pc.product_id = pd.id)) AS categories,

                -- Created/Updated by
                (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
                WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = pd.created_by) AS "createdBy",
                (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
                WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = pd.updated_by) AS "updatedBy"
                FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.id != $3 ORDER BY pd.created_at ASC LIMIT $4 OFFSET $5`;

    return {
      name: 'get-products-not-id',
      text,
      values: [languageId, defaultLanguageId, id, limit, offset],
    };
  }

  public insertProductContent(...args: ProductType[keyof ProductType][]) {
    const text = `INSERT INTO product(
            store_id, sku, sale_price, compare_price, buying_price, quantity,
            type, published, disable_out_of_stock, free_shipping, display_product_measurements,
            slug, og_media_id, weight, weight_unit, dimension_width,
            dimension_height, dimension_depth, dimension_unit, created_by)
            VALUES(
              current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, current_setting('app.current_user_id')::uuid)
            RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public insertProductTranslation(...args: ProductType[keyof ProductType][]) {
    const text = `INSERT INTO product_transaction (store_id, product_id, language_id, name, description,
      meta_title, meta_keywords, meta_description, note)
    VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7, NULLIF($8, ''))`;

    return {
      text,
      values: [...args],
    };
  }

  public updateProductContent(...args: ProductType[keyof ProductType][]) {
    const text = `UPDATE product SET published = $2, disable_out_of_stock = $3, free_shipping = $4,
           display_product_measurements = $5, updated_by = current_setting('app.current_user_id')::uuid
           WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1
           RETURNING id, disable_out_of_stock AS "disableOutOfStock", published`;

    return {
      text,
      values: [...args],
    };
  }

  public updateProductContentForSeo(...args: ProductType[keyof ProductType][]) {
    const text = `UPDATE product SET slug = $2, og_media_id = $3, updated_by = current_setting('app.current_user_id')::uuid
           WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1
           RETURNING id, slug, published`;

    return {
      text,
      values: [...args],
    };
  }

  public updateProductTranslation(...args: ProductType[keyof ProductType][]) {
    const text = `INSERT INTO product_transaction(store_id, product_id, language_id, name, description,
                  meta_title, meta_keywords, meta_description, note)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7, $8)
                  ON CONFLICT (store_id, product_id, language_id) DO UPDATE SET
                  name = excluded.name, description = excluded.description,
                  meta_title = excluded.meta_title, meta_keywords = excluded.meta_keywords,
                  meta_description = excluded.meta_description, note = excluded.note
                  `;

    return {
      text,
      values: [...args],
    };
  }

  public updateProductType(id: number, type: 'simple' | 'variable') {
    const text = `UPDATE product SET type = $2 WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id, type],
    };
  }

  public getProductType(id: number) {
    const text = `SELECT type AS "type" FROM product WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public updateSimpleProductInformation(
    ...args: ProductType[keyof ProductType][]
  ) {
    const text = `UPDATE product SET sale_price = $2, compare_price = $3, buying_price = $4,
                  quantity = $5, sku = $6, updated_by = current_setting('app.current_user_id')::uuid
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1
                  RETURNING sale_price AS "salePrice", compare_price AS "comparePrice", buying_price AS "buyingPrice", quantity, sku, type AS "type"`;

    return {
      text,
      values: [...args],
    };
  }

  public productLastUpdatedBy(id: number) {
    const text = `UPDATE product SET updated_by = current_setting('app.current_user_id')::uuid
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  // **** galleries ****

  // COALESCE((SELECT MAX(display_order)+1 FROM categories)
  public insertProductImage(...args: ImageType[keyof ImageType][]) {
    const text = `INSERT INTO product_media(store_id, product_id, media_id, is_thumbnail, position)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updateImage(...args: ImageType[keyof ImageType][]) {
    const text = `UPDATE product_media SET media_id = $3 WHERE store_id = current_setting('app.current_store_id')::uuid
            AND product_id = $1 AND media_id = $2 AND is_thumbnail is TRUE`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteGalleryImage(...args: ImageType[keyof ImageType][]) {
    const text = `DELETE FROM product_media WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND product_id = $1 AND media_id = $2 AND is_thumbnail is FALSE`;

    return {
      text,
      values: [...args],
    };
  }

  // **** product_category ****

  public insertProductCategory(...args: number[]) {
    const text = `INSERT INTO product_category(store_id, product_id, category_id)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteProductCategory(...args: number[]) {
    const text = `DELETE FROM product_category WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND product_id = $1 AND category_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  // **** product_manufacturer ****

  public insertProductManufacturer(...args: number[]) {
    const text = `INSERT INTO product_manufacturer(store_id, product_id, manufacturer_id)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteProductManufacturer(...args: number[]) {
    const text = `DELETE FROM product_manufacturer WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND product_id = $1 AND manufacturer_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  public updateProductShippingInfo(
    ...args: ProductShippingInfo[keyof ProductShippingInfo][]
  ) {
    const text = `UPDATE product_shipping_info SET weight = $2, weight_unit = $3, volume = $4, volume_unit = $5,
    dimension_width = $6, dimension_height = $7, dimension_depth = $8, dimension_unit = $9
    WHERE store_id = current_setting('app.current_store_id')::uuid AND product_id = $1`;

    return {
      text,
      values: [...args],
    };
  }

  // **** product_tag ****

  public insertProductTag(...args: number[]) {
    const text = `INSERT INTO product_tag(store_id, product_id, tag_id)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteProductTag(...args: number[]) {
    const text = `DELETE FROM product_tag WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND product_id = $1 AND tag_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  // **** product_supplier ****

  public insertProductSupplier(...args: number[]) {
    const text = `INSERT INTO product_supplier(store_id, product_id, supplier_id)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteProductSupplier(...args: number[]) {
    const text = `DELETE FROM product_supplier WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND product_id = $1 AND supplier_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  // **** product_attribute ****

  public getProductAttribute(...args: number[]) {
    const text = `SELECT id FROM product_attribute WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND product_id = $1 AND attribute_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  public insertProductAttribute(...args: number[]) {
    const text = `INSERT INTO product_attribute(store_id, product_id, attribute_id)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteProductAttribute(id: number) {
    const text = `DELETE FROM product_attribute WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public deleteAllProductAttribute(id: number) {
    const text = `DELETE FROM product_attribute WHERE store_id = current_setting('app.current_store_id')::uuid AND product_id = $1`;

    return {
      text,
      values: [id],
    };
  }

  // **** attribute_values ****

  public getAttributeValue(id: number) {
    const text = `SELECT attribute_id AS "attributeId" FROM attribute_value
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  // **** product_attribute_value ****

  public getProductAttributeValue(...args: number[]) {
    const text = `SELECT id FROM product_attribute_value WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND product_attribute_id = $1 AND attribute_value_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  public insertProductAttributeValue(...args: number[]) {
    const text = `INSERT INTO product_attribute_value(store_id, product_attribute_id, attribute_value_id)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteProductAttributeValue(
    productAttributeId: number,
    attributeValueId: number
  ) {
    const text = `DELETE FROM product_attribute_value WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND product_attribute_id = $1 AND attribute_value_id = $2`;

    return {
      text,
      values: [productAttributeId, attributeValueId],
    };
  }

  public deleteProductAttributeValueAll(id: number) {
    const text = `DELETE FROM product_attribute_value WHERE store_id = current_setting('app.current_store_id')::uuid AND product_attribute_id = $1`;

    return {
      text,
      values: [id],
    };
  }

  // **** variant_options ****

  public insertVariantOption(
    ...args: ProductVariationOptions[keyof ProductVariationOptions][]
  ) {
    const text = `INSERT INTO variant_option(store_id, title, media_id, product_id, sale_price, compare_price, buying_price, quantity, sku, active)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updateVariantOption(
    ...args: ProductVariationOptions[keyof ProductVariationOptions][]
  ) {
    const text = `UPDATE variant_option SET title = $2, media_id = $3, sale_price = $4, compare_price = $5,
                  buying_price = $6, quantity = $7, sku = $8, active = $9
                  WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [...args],
    };
  }

  public getVariantIdByOptionId(id: number) {
    const text = `SELECT id FROM variant WHERE store_id = current_setting('app.current_store_id')::uuid AND variant_option_id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public deleteVariantOption(id: number) {
    const text = `DELETE FROM variant_option WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public deleteProductVariantOption(id: number) {
    const text = `DELETE FROM variant_option WHERE store_id = current_setting('app.current_store_id')::uuid AND product_id = $1`;

    return {
      text,
      values: [id],
    };
  }

  // **** variant ****

  public insertVariant(...args: (string | number)[]) {
    const text = `INSERT INTO variant(store_id, variant_option, product_id, variant_option_id)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteVariant(id: number) {
    const text = `DELETE FROM variant WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [id],
    };
  }

  public deleteProductVariants(id: number) {
    const text = `DELETE FROM variant WHERE store_id = current_setting('app.current_store_id')::uuid AND product_id = $1`;

    return {
      text,
      values: [id],
    };
  }

  // **** variant_value ****

  public insertVariantValue(...args: number[]) {
    const text = `INSERT INTO variant_value(store_id, variant_id, product_attribute_value_id)
                  VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteVariantValue(id: number) {
    const text = `DELETE FROM variant_value WHERE store_id = current_setting('app.current_store_id')::uuid AND variant_id = $1`;

    return {
      text,
      values: [id],
    };
  }

  // --- related_product
  public insertRelatedProduct(...args: number[]) {
    const text = `INSERT INTO related_product(store_id, product_id, related_product_id)
            VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteRelatedProduct(...args: number[]) {
    const text = `DELETE FROM related_product WHERE
                  store_id = current_setting('app.current_store_id')::uuid AND product_id = $1 AND related_product_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  // --- upsell_product
  public insertUpsellProduct(...args: number[]) {
    const text = `INSERT INTO upsell_product(store_id, product_id, upsell_product_id)
            VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteUpsellProduct(...args: number[]) {
    const text = `DELETE FROM upsell_product WHERE
                  store_id = current_setting('app.current_store_id')::uuid AND product_id = $1 AND upsell_product_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  // --- cross_sell_product
  public insertCrossSellProduct(...args: number[]) {
    const text = `INSERT INTO cross_sell_product(store_id, product_id, cross_sell_product_id)
            VALUES(current_setting('app.current_store_id')::uuid, $1, $2)`;

    return {
      text,
      values: [...args],
    };
  }

  public deleteCrossSellProduct(...args: number[]) {
    const text = `DELETE FROM cross_sell_product WHERE
                  store_id = current_setting('app.current_store_id')::uuid AND product_id = $1 AND cross_sell_product_id = $2`;

    return {
      text,
      values: [...args],
    };
  }

  public getProductSeoBySlug(slug: string) {
    const text = `SELECT seo.id, seo.slug, seo.product_id AS "productId", seo.meta_title AS "metaTitle", seo.meta_keywords AS "metaKeywords", seo.meta_description AS "metaDescription",
    ARRAY(SELECT json_build_object('id', photo_seo.id ,'image', photo_seo.image_path, 'placeholder', photo_seo.placeholder_path) FROM media AS photo_seo WHERE
    photo_seo.store_id = current_setting('app.current_store_id')::uuid AND photo_seo.id = seo.media_id) AS "metaImage"
    FROM product_seo seo WHERE seo.store_id = current_setting('app.current_store_id')::uuid AND seo.slug = $1`;

    return {
      name: 'get-product-seo-by-slug',
      text,
      values: [slug],
    };
  }

  // Make sure we are using index only scan for this query
  public getProductSlugById(id: number) {
    const text = `SELECT slug FROM product WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      name: 'get-product-slug-by-id',
      text,
      values: [id],
    };
  }

  // --- Popular Product

  public getPopularProducts(languageId: number) {
    const text = `SELECT pd.id,
    (SELECT pt.name FROM product_transaction AS pt WHERE store_id = current_setting('app.current_store_id')::uuid AND pt.product_id = pd.id AND pt.language_id = $1),
    pd.disable_out_of_stock AS "disableOutOfStock",
    jsonb_build_object('id', pd.type) AS "type",
    -- Quantity
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
      FROM variant_option vp WHERE vp.store_id = current_setting('app.current_store_id')::uuid
      AND vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",
    -- Stock
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity >= 1
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity) >= 1
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "inStock",
    -- Price
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN pd.sale_price END AS "salePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT DISTINCT ON(vp.compare_price) vp.compare_price
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE ORDER BY vp.compare_price LIMIT 1)
      WHEN pd.type = 'simple' THEN pd.compare_price END AS "comparePrice",
    -- maxPrice/minPrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxPrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minPrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail
    -- Seo
    -- (SELECT ps.slug FROM product_seo AS ps WHERE ps.store_id = current_setting('app.current_store_id')::uuid AND ps.product_id = pd.id) AS slug
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.published IS TRUE`;

    return {
      name: 'get-popular-products',
      text,
      values: [languageId],
    };
  }

  public getStoreProductRelatedProducts(id: number) {
    const text = `SELECT pd.id, pd.name AS name, pd.disable_out_of_stock AS "disableOutOfStock",
    jsonb_build_object('id', pd.type) AS "type",
    -- Quantity
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
      FROM variant_option vp WHERE vp.store_id = current_setting('app.current_store_id')::uuid
      AND vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",
    -- Stock
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity >= 1
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity) >= 1
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "inStock",
    -- Price
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN pd.sale_price END AS "salePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT DISTINCT ON(vp.compare_price) vp.compare_price
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE ORDER BY vp.compare_price LIMIT 1)
      WHEN pd.type = 'simple' THEN pd.compare_price END AS "comparePrice",
    -- maxPrice/minPrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxPrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minPrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail,
    -- Seo
    -- (SELECT ps.slug FROM product_seo AS ps WHERE ps.store_id = current_setting('app.current_store_id')::uuid AND ps.product_id = pd.id) AS slug
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.published IS TRUE AND pd.id IN
                  (SELECT related_product_id FROM related_product rp WHERE rp.store_id = current_setting('app.current_store_id')::uuid AND rp.product_id = $1)`;

    return {
      name: 'get-store-product-related-products',
      text,
      values: [id],
    };
  }

  public getStoreProductUpsellProducts(id: number) {
    const text = `SELECT pd.id, pd.name AS name, pd.disable_out_of_stock AS "disableOutOfStock",
    jsonb_build_object('id', pd.type) AS "type",
    -- Quantity
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
      FROM variant_option vp WHERE vp.store_id = current_setting('app.current_store_id')::uuid
      AND vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",
    -- Stock
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity >= 1
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity) >= 1
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "inStock",
    -- Price
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN pd.sale_price END AS "salePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT DISTINCT ON(vp.compare_price) vp.compare_price
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE ORDER BY vp.compare_price LIMIT 1)
      WHEN pd.type = 'simple' THEN pd.compare_price END AS "comparePrice",
    -- maxPrice/minPrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxPrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minPrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail,
    -- Seo
    -- (SELECT ps.slug FROM product_seo AS ps WHERE ps.store_id = current_setting('app.current_store_id')::uuid AND ps.product_id = pd.id) AS slug
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.published IS TRUE AND pd.id IN
    (SELECT upsell_product_id FROM upsell_product usp WHERE usp.store_id = current_setting('app.current_store_id')::uuid AND usp.product_id = $1)`;

    return {
      name: 'get-store-product-upsell-products',
      text,
      values: [id],
    };
  }

  public getStoreProductCrossSellProducts(id: number) {
    const text = `SELECT pd.id, pd.name AS name, pd.disable_out_of_stock AS "disableOutOfStock",
    jsonb_build_object('id', pd.type) AS "type",
    -- Quantity
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
      FROM variant_option vp WHERE vp.store_id = current_setting('app.current_store_id')::uuid
      AND vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",
    -- Stock
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity >= 1
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity) >= 1
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "inStock",
    -- Price
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN pd.sale_price END AS "salePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT DISTINCT ON(vp.compare_price) vp.compare_price
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE ORDER BY vp.compare_price LIMIT 1)
      WHEN pd.type = 'simple' THEN pd.compare_price END AS "comparePrice",
    -- maxPrice/minPrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxPrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minPrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail,
    -- Seo
    -- (SELECT ps.slug FROM product_seo AS ps WHERE ps.store_id = current_setting('app.current_store_id')::uuid AND ps.product_id = pd.id) AS slug
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.published IS TRUE AND pd.id IN
    (SELECT cross_sell_product_id FROM cross_sell_product csp WHERE csp.store_id = current_setting('app.current_store_id')::uuid AND csp.product_id = $1)`;

    return {
      name: 'get-store-product-cross-sell-products',
      text,
      values: [id],
    };
  }

  public getCategoryProducts(
    categoryId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT pd.id, pd.name AS name, pd.disable_out_of_stock AS "disableOutOfStock",
    jsonb_build_object('id', pd.type) AS "type",
    -- Quantity
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
      FROM variant_option vp WHERE vp.store_id = current_setting('app.current_store_id')::uuid
      AND vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",
    -- Stock
    CASE
      WHEN pd.type = 'simple' THEN pd.quantity >= 1
      WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity) >= 1
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "inStock",
    -- Price
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN pd.sale_price END AS "salePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT DISTINCT ON(vp.compare_price) vp.compare_price
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE ORDER BY vp.compare_price LIMIT 1)
      WHEN pd.type = 'simple' THEN pd.compare_price END AS "comparePrice",
    -- maxPrice/minPrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxPrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minPrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail,
    -- Seo
    (SELECT ps.slug FROM product_seo AS ps WHERE ps.store_id = current_setting('app.current_store_id')::uuid AND ps.product_id = pd.id) AS slug
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.published IS TRUE AND pd.id IN (SELECT pc.product_id FROM product_category pc
      WHERE pc.store_id = current_setting('app.current_store_id')::uuid AND pc.category_id = $1) ORDER BY pd.sale_price ASC LIMIT $2 OFFSET $3`;

    return {
      name: 'get-category-products',
      text,
      values: [categoryId, limit, offset],
    };
  }
}
