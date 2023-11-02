import { ImageType, MediaType } from '@ts-types/interfaces';
import { Service } from 'typedi';
import CommonQueryString from './common.sql';

@Service()
export default class MediaQueryString extends CommonQueryString {
  public getPhotos(limit: number, offset: number) {
    const text = `SELECT id, image_path AS image, placeholder_path AS placeholder, size, created_at AS "createdAt"
    FROM media WHERE store_id = current_setting('app.current_store_id')::uuid
    ORDER BY created_at ASC LIMIT $1 OFFSET $2`;

    return {
      name: 'get-photos',
      text,
      values: [limit, offset],
    };
  }

  public getMediaChildren(id: string) {
    const text = `SELECT id, parent_id AS "parentId", name, items_count AS "itemsCount", created_at AS "createdAt",
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path, 'size', photo.size, 'createdAt', photo.created_at,
          'width', photo.width, 'height', photo.height, 'mimeType', photo.mime_type)
    FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = media_id)) AS image
    FROM media_folder WHERE store_id = current_setting('app.current_store_id')::uuid and parent_id = $1 ORDER BY created_at ASC`;

    return {
      name: 'get-media-children',
      text,
      values: [id],
    };
  }

  public getMediaItem(id: string) {
    const text = `SELECT id, parent_id AS "parentId", name, items_count AS "itemsCount", created_at AS "createdAt"
    FROM media_folder WHERE store_id = current_setting('app.current_store_id')::uuid and id = $1`;

    return {
      name: 'get-media-item',
      text,
      values: [id],
    };
  }

  public getMediaItemRoot() {
    const text = `SELECT id, parent_id AS "parentId", name, items_count AS "itemsCount", created_at AS "createdAt",
    ARRAY((SELECT json_build_object('id', photo.id, 'image', photo.image_path, 'placeholder', photo.placeholder_path,
    'size', photo.size, 'createdAt', photo.created_at, 'width', photo.width, 'height', photo.height, 'mimeType', photo.mime_type)
    FROM media AS photo WHERE photo.store_id = current_setting('app.current_store_id')::uuid AND photo.id = media_id)) AS image
    FROM media_folder WHERE store_id = current_setting('app.current_store_id')::uuid AND parent_id IS NULL ORDER BY created_at ASC`;

    return {
      name: 'get-media-item-root',
      text,
      values: [],
    };
  }

  public insertPhoto(...args: ImageType[keyof ImageType][]) {
    const text = `INSERT INTO media(store_id, image_path, placeholder_path, size, width, height, mime_type)
    VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3, $4, $5, $6) RETURNING id`;

    return {
      text,
      values: [...args],
    };
  }

  public createMediaFolder(...args: MediaType[keyof MediaType][]) {
    const text = `INSERT INTO media_folder(store_id, parent_id, name)
    VALUES(current_setting('app.current_store_id')::uuid, $1, $2) RETURNING id, name`;

    return {
      text,
      values: [...args],
    };
  }

  public incrementParentMediaItem(...args: MediaType[keyof MediaType][]) {
    const text = `UPDATE media_folder SET items_count = COALESCE(items_count, 0) + 1 WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [...args],
    };
  }

  public decrementParentMediaItem(...args: MediaType[keyof MediaType][]) {
    const text = `UPDATE media_folder SET items_count = GREATEST(COALESCE(items_count, 0) - 1, 0) WHERE store_id = current_setting('app.current_store_id')::uuid AND id = $1`;

    return {
      text,
      values: [...args],
    };
  }

  public insertMediaPhotoWithParentId(...args: MediaType[keyof MediaType][]) {
    const text = `INSERT INTO media_folder(store_id, parent_id, media_id, name)
    VALUES(current_setting('app.current_store_id')::uuid, $1, $2, $3) RETURNING id, name`;

    return {
      text,
      values: [...args],
    };
  }

  public insertMediaPhoto(...args: MediaType[keyof MediaType][]) {
    const text = `INSERT INTO media_folder(store_id, media_id, name)
    VALUES(current_setting('app.current_store_id')::uuid, $1, $2) RETURNING id, name`;

    return {
      text,
      values: [...args],
    };
  }

  public deletePhotoSource(id: number) {
    const text = `DELETE FROM media WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND id = $1 RETURNING id, image_path AS image, placeholder_path AS placeholder`;

    return {
      text,
      values: [id],
    };
  }

  public deleteMedia(id: string) {
    const text = `DELETE FROM media_folder WHERE store_id = current_setting('app.current_store_id')::uuid
                  AND id = $1 RETURNING id`;

    return {
      text,
      values: [id],
    };
  }

  public createDefaultMedia(): string {
    return `INSERT INTO media_folder (store_id, parent_id, name) VALUES
    ( current_setting('app.current_store_id')::uuid, null, 'Category Media'),
    ( current_setting('app.current_store_id')::uuid, null, 'Product Manufacturer Media'),
    ( current_setting('app.current_store_id')::uuid, null, 'Product Media'),
    ( current_setting('app.current_store_id')::uuid, null, 'User Media'),
    ( current_setting('app.current_store_id')::uuid, null, 'Theme Media')`;
  }
}
