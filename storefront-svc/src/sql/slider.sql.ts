import { HeroSlideType, PromoSlideType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class SliderQueryString extends CommonQueryString {
  public getHeroSlideList(
    languageId: number,
    defaultLanguageId: number,
    limit: number,
    offset: number
  ) {
    const text = `SELECT slide.id, slide.position, slide.published, slide.created_at AS "createdAt", slide.updated_at AS "updatedAt",
     -- Thumbnail
     ARRAY((SElECT json_build_object('image', photo.image_path, 'placeholder', photo.placeholder_path) FROM media AS photo
     WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = slide.media_id)) AS thumbnail,
     -- Translation
    (SELECT hst.title FROM hero_slider_translation AS hst WHERE hst.store_id = current_setting('app.current_store_id')::uuid AND hst.hero_slider_id = slide.id AND hst.language_id = $1),
    (SELECT json_build_object(
      'title', (SELECT hstd.title FROM hero_slider_translation AS hstd WHERE hstd.store_id = current_setting('app.current_store_id')::uuid AND hstd.hero_slider_id = slide.id AND hstd.language_id = $2))) AS translated,
     -- Created/Updated by
     (SELECT json_build_object('id', stc.id, 'firstName', stc.first_name, 'lastName', stc.last_name) FROM user_account AS stc
     WHERE stc.store_id = current_setting('app.current_store_id')::uuid AND stc.id = slide.created_by) AS "createdBy",
     (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
     WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = slide.updated_by) AS "updatedBy"
    FROM hero_slider AS slide WHERE slide.store_id = current_setting('app.current_store_id')::uuid ORDER BY slide.position ASC LIMIT $3 OFFSET $4`;

    return {
      name: 'get-hero-slide-list',
      text,
      values: [languageId, defaultLanguageId, limit, offset],
    };
  }

  public getHeroSlider() {
    const text = `SELECT slide.id, slide.url, slide.styles,
    -- Thumbnail
    ARRAY((SElECT json_build_object('id', media.id, 'image', media.image_path, 'placeholder', media.placeholder_path) FROM media AS media
    WHERE media.store_id = current_setting('app.current_store_id')::uuid AND media.id = slide.media_id)) AS thumbnail
    FROM hero_slider AS slide WHERE slide.store_id = current_setting('app.current_store_id')::uuid AND slide.published IS TRUE ORDER BY slide.position ASC`;

    return {
      name: 'get-hero-slider',
      text,
      values: [],
    };
  }

  public getHeroSlide(id: number) {
    const text = `SELECT slide.id, slide.url, slide.styles, slide.position, slide.published,
            -- Thumbnail
            ARRAY((SElECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path)
            FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = slide.media_id)) AS thumbnail
            FROM hero_slider AS slide WHERE slide.store_id = current_setting('app.current_store_id')::uuid AND slide.id = $1`;

    return {
      name: 'get-hero-slide',
      text,
      values: [id],
    };
  }

  public getHeroSlideTranslation(id: number, languageId: number) {
    const text = `SELECT align, title, description, btn_label AS "btnLabel" FROM hero_slider_translation
                  WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND hero_slider_id = $1 AND language_id = $2`;

    return {
      name: 'get-hero-slider-translation',
      text,
      values: [id, languageId],
    };
  }

  public getPromoSlide() {
    const text = `SELECT ps.id, ps.animation_speed AS "animationSpeed", delay_speed AS "delaySpeed", ps.background_color AS "backgroundColor",ps.published, ps.updated_at AS "updatedAt",
                  (SELECT json_build_object('id', stu.id, 'firstName', stu.first_name, 'lastName', stu.last_name) FROM user_account AS stu
                  WHERE stu.store_id = current_setting('app.current_store_id')::uuid AND stu.id = ps.updated_by) AS "updatedBy"
                  FROM promo_slider AS ps WHERE ps.store_id = current_setting('app.current_store_id')::uuid`;

    return {
      name: 'get-promo-slide',
      text,
      values: [],
    };
  }

  public getPromoSlideTranslation(id: number, languageId: number) {
    const text = `SELECT direction, sliders FROM promo_slider_translation WHERE store_id = current_setting('app.current_store_id')::uuid AND promo_slider_id = $1 AND language_id = $2`;

    return {
      name: 'get-promo-slide-translation',
      text,
      values: [id, languageId],
    };
  }

  public getStorePromoSlide() {
    const text = `SELECT id, animation_speed AS "animationSpeed", delay_speed AS "delaySpeed", background_color AS "backgroundColor", direction, published, sliders
                  FROM promo_slider WHERE store_id = current_setting('app.current_store_id')::uuid`;

    return {
      name: 'get-store-promo-slide',
      text,
      values: [],
    };
  }

  public insertHeroSlider(
    url: string | null | undefined,
    media_id: number,
    position: number,
    published: boolean,
    styles: any
  ) {
    const text = `INSERT INTO hero_slider(store_id, url, media_id, position, published, styles)
    VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5) RETURNING id`;
    return {
      text,
      values: [url, media_id, position, published, styles],
    };
  }

  public insertHeroSliderTranslation(
    heroSliderId: number,
    languageId: number,
    align: 'left' | 'center' | 'right',
    title: string,
    description: string | undefined | null,
    btn_label: string | undefined | null
  ) {
    const text = `INSERT INTO hero_slider_translation (store_id, hero_slider_id, language_id, align, title, description, btn_label)
    VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6)`;

    return {
      text,
      values: [heroSliderId, languageId, align, title, description, btn_label],
    };
  }

  public updateHeroSlider(...args: HeroSlideType[keyof HeroSlideType][]) {
    const text = `UPDATE hero_slider SET url = $2, media_id = $3, position = $4, published = $5,
             styles = $6, updated_by = current_setting('app.current_user_id')::uuid
             WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updateHeroSliderTranslation(
    ...args: HeroSlideType[keyof HeroSlideType][]
  ) {
    const text = `INSERT INTO hero_slider_translation (store_id, hero_slider_id, language_id, align, title, description, btn_label)
                  VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6)
                  ON CONFLICT (store_id, hero_slider_id, language_id) DO UPDATE SET align = excluded.align,
                  title = excluded.title, description = excluded.description, btn_label = excluded.btn_label`;

    return {
      text,
      values: [...args],
    };
  }

  public updatePromoSlide(...args: PromoSlideType[keyof PromoSlideType][]) {
    const text = `UPDATE promo_slider SET animation_speed = $2, delay_speed = $3, background_color = $4,
             published = $5, updated_by = current_setting('app.current_user_id')::uuid
             WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public updatePromoSlideTranslation(
    promoId: number,
    languageId: number,
    direction: 'RLT' | 'LTR',
    sliders: any
  ) {
    const text = `UPDATE promo_slider_translation SET direction = $3, sliders = $4 WHERE
                  store_id = current_setting('app.current_store_id')::uuid AND promo_slider_id = $1 AND language_id = $2`;

    return {
      text,
      values: [promoId, languageId, direction, sliders],
    };
  }

  public deleteSlide(id: number) {
    const text = `DELETE FROM hero_slider WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1 RETURNING id`;

    return {
      text,
      values: [id],
    };
  }

  public insertPromoSlide(
    animationSpeed: number,
    delaySpeed: number,
    backgroundColor: string,
    published: boolean
  ) {
    const text = `INSERT INTO promo_slider(store_id, animation_speed, delay_speed, background_color, published)
    VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4) RETURNING id`;

    return {
      text,
      values: [animationSpeed, delaySpeed, backgroundColor, published],
    };
  }

  public insertPromoSlideTranslation(
    promoId: number,
    languageId: number,
    direction: string,
    sliders: any
  ) {
    const text = `INSERT INTO promo_slider_translation (store_id, promo_slider_id, language_id, direction, sliders) VALUES (current_setting('app.current_store_id')::uuid, $1, $2, $3, $4)`;

    return {
      text,
      values: [promoId, languageId, direction, sliders],
    };
  }

  public createDefaultHeroSliderImage(
    image_path: string,
    placeholder_path: string
  ) {
    const text = `INSERT INTO media(store_id, file_name, image_path, placeholder_path, size, width, height, mime_type)
    VALUES(current_setting('app.current_store_id')::uuid, 'Xbox', $1, $2, 682400, 1000, 351, 'image/png') RETURNING id`;

    return {
      text,
      values: [image_path, placeholder_path],
    };
  }
}
