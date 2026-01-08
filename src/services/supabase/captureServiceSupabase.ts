/**
 * Capture Service - Supabase Storage Implementation
 *
 * This module provides image management operations using Supabase Storage.
 * It handles uploading, listing, and deleting case images.
 *
 * Storage Structure:
 * - Bucket: case-images
 * - Path format: cases/{caseId}/{imageId}-{originalName}
 */

import { CaptureImage } from '@/types/capture';
import { initSupabaseClient } from './supabaseClient';

const BUCKET_NAME = 'case-images';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates if a file is a valid image
 */
function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type) && file.size <= MAX_FILE_SIZE;
}

/**
 * Generates a unique image ID
 */
function generateImageId(): string {
  return crypto.randomUUID?.() || `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Constructs the storage path for an image
 */
function getStoragePath(caseId: string, imageId: string, fileName: string): string {
  // Remove problematic characters from fileName for storage path
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `cases/${caseId}/${imageId}-${cleanFileName}`;
}

/**
 * Upload case images to Supabase Storage
 * Returns array of CaptureImage objects with public URLs
 */
export async function uploadCaseImages(
  caseId: string,
  files: File[]
): Promise<CaptureImage[]> {
  try {
    const supabase = await initSupabaseClient();
    const uploadedImages: CaptureImage[] = [];

    for (const file of files) {
      // Validate file
      if (!isValidImageFile(file)) {
        console.warn(
          `[CaptureServiceSupabase] File skipped - invalid type or too large: ${file.name}`
        );
        continue;
      }

      const imageId = generateImageId();
      const storagePath = getStoragePath(caseId, imageId, file.name);

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('[CaptureServiceSupabase] Upload error:', uploadError.message);
        throw new Error(`Failed to upload image ${file.name}: ${uploadError.message}`);
      }

      // Get public URL for the uploaded file
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
      const publicUrl = data?.publicUrl || '';

      // Create CaptureImage object
      const captureImage: CaptureImage = {
        id: imageId,
        caseId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
        createdAt: new Date().toISOString(),
      };

      uploadedImages.push(captureImage);
    }

    if (uploadedImages.length === 0) {
      throw new Error('No valid images were uploaded');
    }

    return uploadedImages;
  } catch (error) {
    console.error('[CaptureServiceSupabase] Unexpected error in uploadCaseImages:', error);
    throw error;
  }
}

/**
 * List all images for a specific case
 * Retrieves metadata from storage and constructs CaptureImage objects
 */
export async function listCaseImages(caseId: string): Promise<CaptureImage[]> {
  try {
    const supabase = await initSupabaseClient();
    const folderPath = `cases/${caseId}`;

    // List files in the case folder
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folderPath);

    if (error) {
      console.error('[CaptureServiceSupabase] Error listing images:', error.message);
      throw new Error(`Failed to list images: ${error.message}`);
    }

    if (!files || files.length === 0) {
      return [];
    }

    // Convert storage files to CaptureImage objects
    const images: CaptureImage[] = files
      .filter((file) => !file.name.includes('.')) // Skip folders
      .map((file) => {
        // Parse image ID from file name (format: imageId-fileName)
        const [imageId, ...fileNameParts] = file.name.split('-');
        const fileName = fileNameParts.join('-');
        const storagePath = `${folderPath}/${file.name}`;

        // Get public URL
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

        return {
          id: imageId,
          caseId,
          name: fileName || file.name,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || 'image/unknown',
          url: data?.publicUrl || '',
          createdAt: file.created_at || new Date().toISOString(),
        };
      });

    return images;
  } catch (error) {
    console.error('[CaptureServiceSupabase] Unexpected error in listCaseImages:', error);
    throw error;
  }
}

/**
 * Delete a specific image from a case
 */
export async function deleteCaseImage(imageId: string, storagePath: string): Promise<void> {
  try {
    const supabase = await initSupabaseClient();

    // Validate path format to prevent directory traversal
    if (storagePath.includes('..') || !storagePath.startsWith('cases/')) {
      throw new Error('Invalid storage path');
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([storagePath]);

    if (error) {
      console.error('[CaptureServiceSupabase] Error deleting image:', error.message);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('[CaptureServiceSupabase] Unexpected error in deleteCaseImage:', error);
    throw error;
  }
}

/**
 * Delete all images for a specific case
 * Useful when deleting a case
 */
export async function deleteCaseAllImages(caseId: string): Promise<void> {
  try {
    const images = await listCaseImages(caseId);

    if (images.length === 0) {
      return;
    }

    const filePaths = images.map((img) => `cases/${caseId}/${img.id}-${img.name}`);
    const supabase = await initSupabaseClient();

    const { error } = await supabase.storage.from(BUCKET_NAME).remove(filePaths);

    if (error) {
      console.error('[CaptureServiceSupabase] Error deleting case images:', error.message);
      throw new Error(`Failed to delete case images: ${error.message}`);
    }
  } catch (error) {
    console.error('[CaptureServiceSupabase] Unexpected error in deleteCaseAllImages:', error);
    throw error;
  }
}
