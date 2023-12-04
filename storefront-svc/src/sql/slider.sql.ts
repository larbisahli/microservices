import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class SliderQueryString extends CommonQueryString {
  public getHeroSlides(storeLanguageId: number) {
    const text = `SELECT slide.id, slide.url, slide.styles, slide.position,
    -- Translation (use joins)
    (SELECT hst.align FROM hero_slider_translation AS hst WHERE hst.store_id = current_setting('app.current_store_id')::uuid AND hst.hero_slider_id = slide.id AND hst.language_id = $1),
    (SELECT hst.title FROM hero_slider_translation AS hst WHERE hst.store_id = current_setting('app.current_store_id')::uuid AND hst.hero_slider_id = slide.id AND hst.language_id = $1),
    (SELECT hst.description FROM hero_slider_translation AS hst WHERE hst.store_id = current_setting('app.current_store_id')::uuid AND hst.hero_slider_id = slide.id AND hst.language_id = $1),
    (SELECT hst.btn_label AS "btnLabel" FROM hero_slider_translation AS hst WHERE hst.store_id = current_setting('app.current_store_id')::uuid AND hst.hero_slider_id = slide.id AND hst.language_id = $1),
    -- Thumbnail
    ARRAY((SElECT json_build_object('id', media.id, 'image', media.image_path, 'placeholder', media.placeholder_path) FROM media AS media
    WHERE media.store_id = current_setting('app.current_store_id')::uuid AND media.id = slide.media_id)) AS thumbnail
    FROM hero_slider AS slide WHERE slide.store_id = current_setting('app.current_store_id')::uuid AND slide.published IS TRUE ORDER BY slide.position ASC`;

    return {
      name: 'get-hero-slides',
      text,
      values: [storeLanguageId],
    };
  }

  public getStorePromoSlide() {
    const text = `SELECT id, delay_speed AS "delaySpeed", background_color AS "backgroundColor"
                  FROM promo_slider WHERE store_id = current_setting('app.current_store_id')::uuid AND published is TRUE`;

    return {
      name: 'get-store-promo-slide',
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
}
