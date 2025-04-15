// Gallery Feature - Supabase Queries
import { createClient } from "@/lib/supabase-server";
import { createClient as createBrowserClient } from "@/lib/supabase-browser";
import { GalleryImage, GalleryImageWithDog, GalleryAlbum, GalleryImageUploadData, GalleryAlbumCreateData, GalleryImageUpdateData, GalleryAlbumUpdateData } from "../types";

/**
 * Server-side queries (for use in Netlify functions and server components)
 */
export const galleryQueries = {
  /**
   * Get all images for a dog
   * @param dogId - The ID of the dog
   * @returns Array of gallery images
   */
  getDogImages: async (dogId: string): Promise<GalleryImage[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("dog_id", dogId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching dog images:", error);
      throw new Error(`Failed to fetch dog images: ${error.message}`);
    }

    return data as GalleryImage[];
  },

  /**
   * Get all public images
   * @param limit - The maximum number of images to return
   * @returns Array of gallery images with dog information
   */
  getPublicImages: async (limit: number = 20): Promise<GalleryImageWithDog[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select(`
        *,
        dog:dogs(id, name, breed)
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching public images:", error);
      throw new Error(`Failed to fetch public images: ${error.message}`);
    }

    return data as GalleryImageWithDog[];
  },

  /**
   * Get an image by ID
   * @param imageId - The ID of the image
   * @returns Gallery image with dog information
   */
  getImageById: async (imageId: string): Promise<GalleryImageWithDog | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select(`
        *,
        dog:dogs(id, name, breed)
      `)
      .eq("id", imageId)
      .single();

    if (error) {
      console.error("Error fetching image:", error);
      throw new Error(`Failed to fetch image: ${error.message}`);
    }

    if (!data) return null;

    return data as GalleryImageWithDog;
  },

  /**
   * Get all albums for a user
   * @param userId - The ID of the user
   * @returns Array of gallery albums
   */
  getUserAlbums: async (userId: string): Promise<GalleryAlbum[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user albums:", error);
      throw new Error(`Failed to fetch user albums: ${error.message}`);
    }

    return data as GalleryAlbum[];
  },

  /**
   * Get an album by ID
   * @param albumId - The ID of the album
   * @returns Gallery album with images
   */
  getAlbumById: async (albumId: string): Promise<GalleryAlbum | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_albums")
      .select(`
        *,
        images:gallery_album_images(
          gallery_images(*)
        )
      `)
      .eq("id", albumId)
      .single();

    if (error) {
      console.error("Error fetching album:", error);
      throw new Error(`Failed to fetch album: ${error.message}`);
    }

    if (!data) return null;

    // Flatten the nested structure
    const album = {
      ...data,
      images: data.images.map((item: any) => item.gallery_images)
    };

    return album as GalleryAlbum;
  },

  /**
   * Create a new album
   * @param userId - The ID of the user
   * @param albumData - The album data to create
   * @returns The created album
   */
  createAlbum: async (userId: string, albumData: GalleryAlbumCreateData): Promise<GalleryAlbum> => {
    const supabase = createClient();
    
    // Create the album
    const { data: album, error: albumError } = await supabase
      .from("gallery_albums")
      .insert({
        user_id: userId,
        title: albumData.title,
        description: albumData.description,
        is_public: albumData.is_public,
        cover_image_url: albumData.image_ids && albumData.image_ids.length > 0 ? 
          // We'll set the cover image to the first image in the album
          null : undefined
      })
      .select()
      .single();
    
    if (albumError) {
      console.error("Error creating album:", albumError);
      throw new Error(`Failed to create album: ${albumError.message}`);
    }
    
    // If image IDs are provided, add them to the album
    if (albumData.image_ids && albumData.image_ids.length > 0) {
      const albumImages = albumData.image_ids.map(imageId => ({
        album_id: album.id,
        image_id: imageId
      }));
      
      const { error: imagesError } = await supabase
        .from("gallery_album_images")
        .insert(albumImages);
      
      if (imagesError) {
        console.error("Error adding images to album:", imagesError);
        throw new Error(`Failed to add images to album: ${imagesError.message}`);
      }
      
      // Set the cover image to the first image
      const { data: firstImage, error: imageError } = await supabase
        .from("gallery_images")
        .select("url")
        .eq("id", albumData.image_ids[0])
        .single();
      
      if (!imageError && firstImage) {
        const { error: updateError } = await supabase
          .from("gallery_albums")
          .update({ cover_image_url: firstImage.url })
          .eq("id", album.id);
        
        if (updateError) {
          console.error("Error updating album cover:", updateError);
        }
      }
    }
    
    return album as GalleryAlbum;
  },

  /**
   * Update an album
   * @param albumId - The ID of the album to update
   * @param albumData - The album data to update
   * @returns The updated album
   */
  updateAlbum: async (albumId: string, albumData: GalleryAlbumUpdateData): Promise<GalleryAlbum> => {
    const supabase = createClient();
    
    // Update the album
    const { data: album, error: albumError } = await supabase
      .from("gallery_albums")
      .update({
        title: albumData.title,
        description: albumData.description,
        cover_image_url: albumData.cover_image_url,
        is_public: albumData.is_public
      })
      .eq("id", albumId)
      .select()
      .single();
    
    if (albumError) {
      console.error("Error updating album:", albumError);
      throw new Error(`Failed to update album: ${albumError.message}`);
    }
    
    // If image IDs are provided, update the album images
    if (albumData.image_ids) {
      // First, remove all existing images
      const { error: deleteError } = await supabase
        .from("gallery_album_images")
        .delete()
        .eq("album_id", albumId);
      
      if (deleteError) {
        console.error("Error removing images from album:", deleteError);
        throw new Error(`Failed to remove images from album: ${deleteError.message}`);
      }
      
      // Then, add the new images
      if (albumData.image_ids.length > 0) {
        const albumImages = albumData.image_ids.map(imageId => ({
          album_id: albumId,
          image_id: imageId
        }));
        
        const { error: imagesError } = await supabase
          .from("gallery_album_images")
          .insert(albumImages);
        
        if (imagesError) {
          console.error("Error adding images to album:", imagesError);
          throw new Error(`Failed to add images to album: ${imagesError.message}`);
        }
      }
    }
    
    return album as GalleryAlbum;
  },

  /**
   * Delete an album
   * @param albumId - The ID of the album to delete
   */
  deleteAlbum: async (albumId: string): Promise<void> => {
    const supabase = createClient();
    
    // Delete the album (cascade will delete album_images)
    const { error } = await supabase
      .from("gallery_albums")
      .delete()
      .eq("id", albumId);
    
    if (error) {
      console.error("Error deleting album:", error);
      throw new Error(`Failed to delete album: ${error.message}`);
    }
  },

  /**
   * Update an image
   * @param imageId - The ID of the image to update
   * @param imageData - The image data to update
   * @returns The updated image
   */
  updateImage: async (imageId: string, imageData: GalleryImageUpdateData): Promise<GalleryImage> => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("gallery_images")
      .update({
        title: imageData.title,
        description: imageData.description,
        tags: imageData.tags,
        is_public: imageData.is_public
      })
      .eq("id", imageId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating image:", error);
      throw new Error(`Failed to update image: ${error.message}`);
    }
    
    return data as GalleryImage;
  },

  /**
   * Delete an image
   * @param imageId - The ID of the image to delete
   */
  deleteImage: async (imageId: string): Promise<void> => {
    const supabase = createClient();
    
    // First get the image to find the storage path
    const { data: image, error: fetchError } = await supabase
      .from("gallery_images")
      .select("url, thumbnail_url")
      .eq("id", imageId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching image:", fetchError);
      throw new Error(`Failed to fetch image: ${fetchError.message}`);
    }
    
    // Delete from storage
    if (image) {
      // Extract file paths from URLs
      const getPathFromUrl = (url: string) => {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        return pathParts.slice(pathParts.indexOf('gallery-images') + 1).join('/');
      };
      
      const filesToDelete = [];
      if (image.url) filesToDelete.push(getPathFromUrl(image.url));
      if (image.thumbnail_url) filesToDelete.push(getPathFromUrl(image.thumbnail_url));
      
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase
          .storage
          .from('gallery-images')
          .remove(filesToDelete);
        
        if (storageError) {
          console.error("Error deleting image files:", storageError);
        }
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", imageId);
    
    if (error) {
      console.error("Error deleting image:", error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
};

/**
 * Client-side hooks (for use in React components)
 */
export const useGalleryQueries = () => {
  const supabase = createBrowserClient();
  
  return {
    /**
     * Get all images for a dog
     * @param dogId - The ID of the dog
     * @returns Array of gallery images
     */
    getDogImages: async (dogId: string): Promise<GalleryImage[]> => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("dog_id", dogId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching dog images:", error);
        throw new Error(`Failed to fetch dog images: ${error.message}`);
      }
      
      return data as GalleryImage[];
    },
    
    /**
     * Get all public images
     * @param limit - The maximum number of images to return
     * @returns Array of gallery images with dog information
     */
    getPublicImages: async (limit: number = 20): Promise<GalleryImageWithDog[]> => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select(`
          *,
          dog:dogs(id, name, breed)
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error("Error fetching public images:", error);
        throw new Error(`Failed to fetch public images: ${error.message}`);
      }
      
      return data as GalleryImageWithDog[];
    },
    
    /**
     * Get all albums for the current user
     * @returns Array of gallery albums
     */
    getUserAlbums: async (): Promise<GalleryAlbum[]> => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error("Error getting user:", userError);
        throw new Error(`Failed to get user: ${userError?.message}`);
      }
      
      const { data, error } = await supabase
        .from("gallery_albums")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching user albums:", error);
        throw new Error(`Failed to fetch user albums: ${error.message}`);
      }
      
      return data as GalleryAlbum[];
    },
    
    /**
     * Get an album by ID
     * @param albumId - The ID of the album
     * @returns Gallery album with images
     */
    getAlbumById: async (albumId: string): Promise<GalleryAlbum | null> => {
      const { data, error } = await supabase
        .from("gallery_albums")
        .select(`
          *,
          images:gallery_album_images(
            gallery_images(*)
          )
        `)
        .eq("id", albumId)
        .single();
      
      if (error) {
        console.error("Error fetching album:", error);
        throw new Error(`Failed to fetch album: ${error.message}`);
      }
      
      if (!data) return null;
      
      // Flatten the nested structure
      const album = {
        ...data,
        images: data.images.map((item: any) => item.gallery_images)
      };
      
      return album as GalleryAlbum;
    },
    
    /**
     * Upload an image
     * @param uploadData - The image upload data
     * @returns The created gallery image
     */
    uploadImage: async (uploadData: GalleryImageUploadData): Promise<GalleryImage> => {
      // Generate a unique filename
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${uploadData.dog_id}/${fileName}`;
      
      // Upload the file to storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('gallery-images')
        .upload(filePath, uploadData.file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from('gallery-images')
        .getPublicUrl(uploadData.path);
      
      // Create a thumbnail (in a real app, you might use a serverless function for this)
      // For now, we'll just use the same image
      const thumbnailUrl = urlData.publicUrl;
      
      // Create the gallery image record
      const { data: imageData, error: imageError } = await supabase
        .from("gallery_images")
        .insert({
          dog_id: uploadData.dog_id,
          url: urlData.publicUrl,
          thumbnail_url: thumbnailUrl,
          title: uploadData.title,
          description: uploadData.description,
          tags: uploadData.tags,
          is_public: uploadData.is_public
        })
        .select()
        .single();
      
      if (imageError) {
        console.error("Error creating gallery image record:", imageError);
        throw new Error(`Failed to create gallery image record: ${imageError.message}`);
      }
      
      return imageData as GalleryImage;
    },
    
    /**
     * Create a new album
     * @param albumData - The album data to create
     * @returns The created album
     */
    createAlbum: async (albumData: GalleryAlbumCreateData): Promise<GalleryAlbum> => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error("Error getting user:", userError);
        throw new Error(`Failed to get user: ${userError?.message}`);
      }
      
      // Create the album
      const { data: album, error: albumError } = await supabase
        .from("gallery_albums")
        .insert({
          user_id: userData.user.id,
          title: albumData.title,
          description: albumData.description,
          is_public: albumData.is_public,
          cover_image_url: albumData.image_ids && albumData.image_ids.length > 0 ? 
            // We'll set the cover image to the first image in the album
            null : undefined
        })
        .select()
        .single();
      
      if (albumError) {
        console.error("Error creating album:", albumError);
        throw new Error(`Failed to create album: ${albumError.message}`);
      }
      
      // If image IDs are provided, add them to the album
      if (albumData.image_ids && albumData.image_ids.length > 0) {
        const albumImages = albumData.image_ids.map(imageId => ({
          album_id: album.id,
          image_id: imageId
        }));
        
        const { error: imagesError } = await supabase
          .from("gallery_album_images")
          .insert(albumImages);
        
        if (imagesError) {
          console.error("Error adding images to album:", imagesError);
          throw new Error(`Failed to add images to album: ${imagesError.message}`);
        }
        
        // Set the cover image to the first image
        const { data: firstImage, error: imageError } = await supabase
          .from("gallery_images")
          .select("url")
          .eq("id", albumData.image_ids[0])
          .single();
        
        if (!imageError && firstImage) {
          const { error: updateError } = await supabase
            .from("gallery_albums")
            .update({ cover_image_url: firstImage.url })
            .eq("id", album.id);
          
          if (updateError) {
            console.error("Error updating album cover:", updateError);
          }
        }
      }
      
      return album as GalleryAlbum;
    },
    
    /**
     * Update an album
     * @param albumId - The ID of the album to update
     * @param albumData - The album data to update
     * @returns The updated album
     */
    updateAlbum: async (albumId: string, albumData: GalleryAlbumUpdateData): Promise<GalleryAlbum> => {
      // Update the album
      const { data: album, error: albumError } = await supabase
        .from("gallery_albums")
        .update({
          title: albumData.title,
          description: albumData.description,
          cover_image_url: albumData.cover_image_url,
          is_public: albumData.is_public
        })
        .eq("id", albumId)
        .select()
        .single();
      
      if (albumError) {
        console.error("Error updating album:", albumError);
        throw new Error(`Failed to update album: ${albumError.message}`);
      }
      
      // If image IDs are provided, update the album images
      if (albumData.image_ids) {
        // First, remove all existing images
        const { error: deleteError } = await supabase
          .from("gallery_album_images")
          .delete()
          .eq("album_id", albumId);
        
        if (deleteError) {
          console.error("Error removing images from album:", deleteError);
          throw new Error(`Failed to remove images from album: ${deleteError.message}`);
        }
        
        // Then, add the new images
        if (albumData.image_ids.length > 0) {
          const albumImages = albumData.image_ids.map(imageId => ({
            album_id: albumId,
            image_id: imageId
          }));
          
          const { error: imagesError } = await supabase
            .from("gallery_album_images")
            .insert(albumImages);
          
          if (imagesError) {
            console.error("Error adding images to album:", imagesError);
            throw new Error(`Failed to add images to album: ${imagesError.message}`);
          }
        }
      }
      
      return album as GalleryAlbum;
    },
    
    /**
     * Delete an album
     * @param albumId - The ID of the album to delete
     */
    deleteAlbum: async (albumId: string): Promise<void> => {
      // Delete the album (cascade will delete album_images)
      const { error } = await supabase
        .from("gallery_albums")
        .delete()
        .eq("id", albumId);
      
      if (error) {
        console.error("Error deleting album:", error);
        throw new Error(`Failed to delete album: ${error.message}`);
      }
    },
    
    /**
     * Update an image
     * @param imageId - The ID of the image to update
     * @param imageData - The image data to update
     * @returns The updated image
     */
    updateImage: async (imageId: string, imageData: GalleryImageUpdateData): Promise<GalleryImage> => {
      const { data, error } = await supabase
        .from("gallery_images")
        .update({
          title: imageData.title,
          description: imageData.description,
          tags: imageData.tags,
          is_public: imageData.is_public
        })
        .eq("id", imageId)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating image:", error);
        throw new Error(`Failed to update image: ${error.message}`);
      }
      
      return data as GalleryImage;
    },
    
    /**
     * Delete an image
     * @param imageId - The ID of the image to delete
     */
    deleteImage: async (imageId: string): Promise<void> => {
      // First get the image to find the storage path
      const { data: image, error: fetchError } = await supabase
        .from("gallery_images")
        .select("url, thumbnail_url")
        .eq("id", imageId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching image:", fetchError);
        throw new Error(`Failed to fetch image: ${fetchError.message}`);
      }
      
      // Delete from storage
      if (image) {
        // Extract file paths from URLs
        const getPathFromUrl = (url: string) => {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          return pathParts.slice(pathParts.indexOf('gallery-images') + 1).join('/');
        };
        
        const filesToDelete = [];
        if (image.url) filesToDelete.push(getPathFromUrl(image.url));
        if (image.thumbnail_url) filesToDelete.push(getPathFromUrl(image.thumbnail_url));
        
        if (filesToDelete.length > 0) {
          const { error: storageError } = await supabase
            .storage
            .from('gallery-images')
            .remove(filesToDelete);
          
          if (storageError) {
            console.error("Error deleting image files:", storageError);
          }
        }
      }
      
      // Delete from database
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", imageId);
      
      if (error) {
        console.error("Error deleting image:", error);
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    }
  };
};
