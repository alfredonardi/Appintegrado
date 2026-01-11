/**
 * Capture Service
 * Usa exclusivamente Nhost como backend
 *
 * Responsável por:
 * - Upload de imagens múltiplas
 * - Listagem de imagens por caso
 * - Remoção individual e em massa
 */

import { CaptureImage } from '@/types/capture';

export class CaptureService {
  /**
   * Upload múltiplo de imagens para um caso
   */
  async uploadCaseImages(caseId: string, files: File[]): Promise<CaptureImage[]> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Listar imagens de um caso
   */
  async listCaseImages(caseId: string): Promise<CaptureImage[]> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Remover uma imagem específica
   */
  async deleteCaseImage(caseId: string, imageId: string, storagePath?: string): Promise<void> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Remover todas as imagens de um caso
   */
  async deleteCaseAllImages(caseId: string): Promise<void> {
    throw new Error('Nhost implementation not yet available for this service');
  }
}

export const captureService = new CaptureService();
