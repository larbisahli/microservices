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

  public getProductContent(slug: string) {
    const text = `SELECT pd.id ,pd.sale_price AS "salePrice", pd.compare_price AS "comparePrice", pd.slug, pd.type,
    pd.disable_out_of_stock AS "disableOutOfStock", pd.quantity, pd.published, pd.sku,
    -- og-image
    ARRAY(SELECT json_build_object('id', photo.id ,'image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = pd.og_media_id) AS "metaImage"
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.slug = $1`;

    return {
      name: 'get-store-product-content',
      text,
      values: [slug],
    };
  }

  public getProductShippingInfo(id: number) {
    const text = `SELECT id, weight::INTEGER, json_build_object('unit', weight_unit) AS "weightUnit",
            dimension_width::INTEGER AS "dimensionWidth", dimension_height::INTEGER AS "dimensionHeight", dimension_length::INTEGER
            AS "dimensionLength", json_build_object('unit', dimension_unit) AS "dimensionUnit"
            FROM product WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

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

  public getStoreProductCategories(id: number, storeLanguageId: number) {
    const text = `SELECT cate.id, cate.level, (SELECT json_build_object(
      'name', (SELECT ctp.name FROM category_translation AS ctp WHERE ctp.store_id = current_setting('app.current_store_id')::uuid AND ctp.category_id = pa.id AND ctp.language_id = $2),
      'urlKey', pa.url_key, 'level', pa.level, 'parent', (SELECT json_build_object(
        'name', (SELECT ctp2.name FROM category_translation AS ctp2 WHERE ctp2.store_id = current_setting('app.current_store_id')::uuid AND ctp2.category_id = pa2.id AND ctp2.language_id = $2),
        'urlKey', pa2.url_key, 'level', pa2.level) FROM category AS pa2 WHERE pa2.store_id = current_setting('app.current_store_id')::uuid AND pa2.id = pa.parent_id))
        FROM category AS pa WHERE pa.store_id = current_setting('app.current_store_id')::uuid AND pa.id = cate.parent_id) AS parent,
    (SELECT ct.name FROM category_translation AS ct WHERE ct.store_id = current_setting('app.current_store_id')::uuid AND ct.category_id = cate.id AND ct.language_id = $2),
    cate.breadcrumbs_priority AS "breadcrumbsPriority", cate.url_key AS "urlKey" FROM category AS cate WHERE cate.store_id = current_setting('app.current_store_id')::uuid AND cate.id IN (SELECT pc.category_id FROM product_category pc
            WHERE pc.store_id = current_setting('app.current_store_id')::uuid AND pc.product_id = $1)`;

    return {
      name: 'get-store-product-categories',
      text,
      values: [id, storeLanguageId],
    };
  }

  public getProductTags(languageId: number, id: number) {
    const text = `SELECT tg.id, (SELECT ttl.name FROM tag_translation AS ttl WHERE ttl.store_id = current_setting('app.current_store_id')::uuid AND ttl.tag_id = tg.id AND ttl.language_id = $2)
    FROM tag AS tg WHERE store_id = current_setting('app.current_store_id')::uuid
    AND id IN (SELECT pt.tag_id FROM product_tag pt WHERE pt.store_id = current_setting('app.current_store_id')::uuid AND pt.product_id = $1)`;

    return {
      name: 'get-product-tags',
      text,
      values: [id, languageId],
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

  public getProductVariationForStore(id: number, storeLanguageId: number) {
    const text = `SELECT (SELECT json_build_object('id', pa.attribute_id,'type', att.type,'name', (SELECT at.name FROM attribute_translation AS at WHERE at.store_id = current_setting('app.current_store_id')::uuid AND at.attribute_id = att.id AND at.language_id = $2)) FROM attribute att
                  WHERE att.store_id = current_setting('app.current_store_id')::uuid AND att.id = pa.attribute_id) AS "attribute",
                  ARRAY(SELECT json_build_object('id', pav.attribute_value_id,
                  'name', (SELECT (SELECT avt.name FROM attribute_value_translation AS avt WHERE avt.store_id = current_setting('app.current_store_id')::uuid AND avt.attribute_value_id = att_v.id AND avt.language_id = $2) FROM attribute_value AS att_v WHERE att_v.store_id = current_setting('app.current_store_id')::uuid AND att_v.id = pav.attribute_value_id),
                  'value', (SELECT (SELECT avt.value FROM attribute_value_translation AS avt WHERE avt.store_id = current_setting('app.current_store_id')::uuid AND avt.attribute_value_id = att_v.id AND avt.language_id = $2) FROM attribute_value AS att_v WHERE att_v.store_id = current_setting('app.current_store_id')::uuid AND att_v.id = pav.attribute_value_id)
                  ) FROM product_attribute_value pav WHERE pav.store_id = current_setting('app.current_store_id')::uuid
                  AND pav.product_attribute_id = pa.id) AS "values"
                  FROM product_attribute pa WHERE pa.store_id = current_setting('app.current_store_id')::uuid AND pa.product_id = $1`;

    return {
      name: 'get-product-store-variation',
      text,
      values: [id, storeLanguageId],
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

  public getProductRelatedProducts(
    language: number,
    defaultLanguageId: number,
    id: number
  ) {
    const text = `SELECT pd.id, pd.sku, jsonb_build_object('id', pd.type) AS type, pd.published,
                  -- Translation
                  (SELECT ptt.name FROM product_translation AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
                  (SELECT json_build_object('name', (SELECT pttd.name FROM product_translation AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
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
            (SELECT ptt.name FROM product_translation AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
            (SELECT json_build_object('name', (SELECT pttd.name FROM product_translation AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
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
                  (SELECT ptt.name FROM product_translation AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
                  (SELECT json_build_object(
                    'name', (SELECT pttd.name FROM product_translation AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
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
                (SELECT ptt.name FROM product_translation AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
                (SELECT json_build_object('name', (SELECT pttd.name FROM product_translation AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
                AND pttd.product_id = pd.id AND pttd.language_id = $2))) AS translated,
                -- Quantity
                CASE
                  WHEN pd.type = 'simple' THEN pd.quantity
                  WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
                  FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",

                -- Price
                CASE WHEN pd.type = 'variable' THEN (SELECT MAX(vp.sale_price) FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "maxSalePrice",
                CASE WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price) FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "minSalePrice",
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
                (SELECT ptt.name FROM product_translation AS ptt WHERE ptt.store_id = current_setting('app.current_store_id')::uuid AND ptt.product_id = pd.id AND ptt.language_id = $1),
                (SELECT json_build_object('name', (SELECT pttd.name FROM product_translation AS pttd WHERE pttd.store_id = current_setting('app.current_store_id')::uuid
                AND pttd.product_id = pd.id AND pttd.language_id = $2))) AS translated,

                -- Quantity
                CASE
                  WHEN pd.type = 'simple' THEN pd.quantity
                  WHEN pd.type = 'variable' THEN (SELECT SUM(vp.quantity)
                  FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "quantity",

                -- Price
                CASE WHEN pd.type = 'variable' THEN (SELECT MAX(vp.sale_price) FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "maxSalePrice",
                CASE WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price) FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE) END AS "minSalePrice",
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

  // **** product_attribute ****

  public getProductAttribute(...args: number[]) {
    const text = `SELECT id FROM product_attribute WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND product_id = $1 AND attribute_id = $2`;

    return {
      text,
      values: [...args],
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

  public getProductTranslation(id: number, storeLanguageId: number) {
    const text = `SELECT name, description, meta_title AS "metaTitle", meta_keywords AS "metaKeywords", meta_description AS "metaDescription"
    FROM product_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND product_id = $1 AND language_id = $2`;

    return {
      name: 'get-store-product-translation',
      text,
      values: [id, storeLanguageId],
    };
  }

  // --- Popular Product

  public getPopularProducts(languageId: number) {
    const text = `SELECT pd.id, slug,
    (SELECT pt.name FROM product_translation AS pt WHERE store_id = current_setting('app.current_store_id')::uuid AND pt.product_id = pd.id AND pt.language_id = $1),
    pd.disable_out_of_stock AS "disableOutOfStock", pd.type,
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
    -- maxComparePrice/minComparePrice
    CASE
    WHEN pd.type = 'variable' THEN (SELECT DISTINCT ON(vp.compare_price) vp.compare_price
    FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE ORDER BY vp.compare_price ASC LIMIT 1)
    WHEN pd.type = 'simple' THEN pd.compare_price END AS "minComparePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT DISTINCT ON(vp.compare_price) vp.compare_price
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE ORDER BY vp.compare_price DESC LIMIT 1)
      WHEN pd.type = 'simple' THEN pd.compare_price END AS "maxComparePrice",
    -- maxSalePrice/minSalePrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxSalePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minSalePrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.include_in_homepage IS FALSE AND pd.published IS TRUE`;

    return {
      name: 'get-popular-products',
      text,
      values: [languageId],
    };
  }

  public getStoreProductRelatedProducts(id: number, storeLanguageId: number) {
    const text = `SELECT pd.id, pd.disable_out_of_stock AS "disableOutOfStock", pd.slug,
    (SELECT pt.name FROM product_translation AS pt WHERE store_id = current_setting('app.current_store_id')::uuid AND pt.product_id = pd.id AND pt.language_id = $2), pd.type,
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
    -- maxSalePrice/minSalePrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxSalePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minSalePrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.published IS TRUE AND pd.id IN
                  (SELECT related_product_id FROM related_product rp WHERE rp.store_id = current_setting('app.current_store_id')::uuid AND rp.product_id = $1)`;

    return {
      name: 'get-store-product-related-products',
      text,
      values: [id, storeLanguageId],
    };
  }

  public getStoreProductUpsellProducts(id: number, storeLanguageId: number) {
    const text = `SELECT pd.id, pd.disable_out_of_stock AS "disableOutOfStock", pd.slug,
    (SELECT pt.name FROM product_translation AS pt WHERE store_id = current_setting('app.current_store_id')::uuid AND pt.product_id = pd.id AND pt.language_id = $2), pd.type,
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
    -- maxSalePrice/minSalePrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxSalePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minSalePrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.published IS TRUE AND pd.id IN
    (SELECT upsell_product_id FROM upsell_product usp WHERE usp.store_id = current_setting('app.current_store_id')::uuid AND usp.product_id = $1)`;

    return {
      name: 'get-store-product-upsell-products',
      text,
      values: [id, storeLanguageId],
    };
  }

  public getStoreProductCrossSellProducts(id: number, storeLanguageId: number) {
    const text = `SELECT pd.id, pd.disable_out_of_stock AS "disableOutOfStock", pd.slug,
    (SELECT pt.name FROM product_translation AS pt WHERE store_id = current_setting('app.current_store_id')::uuid AND pt.product_id = pd.id AND pt.language_id = $1), pd.type,
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
    -- maxSalePrice/minSalePrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxSalePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minSalePrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.published IS TRUE AND pd.id IN
    (SELECT cross_sell_product_id FROM cross_sell_product csp WHERE csp.store_id = current_setting('app.current_store_id')::uuid AND csp.product_id = $1)`;

    return {
      name: 'get-store-product-cross-sell-products',
      text,
      values: [id, storeLanguageId],
    };
  }

  public getCategoryProducts(
    categoryId: number,
    storeLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT pd.id, pd.slug,
    (SELECT pt.name FROM product_translation as pt WHERE pt.store_id = current_setting('app.current_store_id')::uuid AND pt.product_id = pd.id AND pt.language_id = $2),
    pd.disable_out_of_stock AS "disableOutOfStock", pd.type,
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
    -- maxSalePrice/minSalePrice
    CASE
      WHEN pd.type = 'variable' THEN (SELECT Max(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "maxSalePrice",
    CASE
      WHEN pd.type = 'variable' THEN (SELECT MIN(vp.sale_price)
      FROM variant_option vp WHERE vp.product_id = pd.id AND vp.active IS TRUE)
      WHEN pd.type = 'simple' THEN 0 END AS "minSalePrice",
    -- Thumbnail
    ARRAY((SELECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo WHERE
    photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = (SELECT media_id FROM product_media AS gal
    WHERE gal.store_id = current_setting('app.current_store_id')::uuid AND gal.product_id = pd.id AND gal.is_thumbnail = true))) AS thumbnail
    FROM product AS pd WHERE pd.store_id = current_setting('app.current_store_id')::uuid AND pd.published IS TRUE AND pd.id IN (SELECT pc.product_id FROM product_category pc
      WHERE pc.store_id = current_setting('app.current_store_id')::uuid AND pc.category_id = $1) ORDER BY pd.sale_price ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-category-products',
      text,
      values: [categoryId, storeLanguageId, limit, offset],
    };
  }
}
