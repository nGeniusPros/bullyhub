// Gallery Feature - Types

/**
 * Gallery Image
 */
export interface GalleryImage {
  id: string;
  dog_id: string;
  url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  tags?: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Gallery Image with Dog Information
 */
export interface GalleryImageWithDog extends GalleryImage {
  dog?: {
    id: string;
    name: string;
    breed: string;
  };
}

/**
 * Gallery Album
 */
export interface GalleryAlbum {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  images?: GalleryImage[];
}

/**
 * Gallery Image Upload Data
 */
export interface GalleryImageUploadData {
  dog_id: string;
  title?: string;
  description?: string;
  tags?: string[];
  is_public: boolean;
  file: File;
}

/**
 * Gallery Album Create Data
 */
export interface GalleryAlbumCreateData {
  title: string;
  description?: string;
  is_public: boolean;
  image_ids?: string[];
}

/**
 * Gallery Image Update Data
 */
export interface GalleryImageUpdateData {
  title?: string;
  description?: string;
  tags?: string[];
  is_public?: boolean;
}

/**
 * Gallery Album Update Data
 */
export interface GalleryAlbumUpdateData {
  title?: string;
  description?: string;
  cover_image_url?: string;
  is_public?: boolean;
  image_ids?: string[];
}
