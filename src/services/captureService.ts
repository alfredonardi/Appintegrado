/**
 * Capture Service
 * Abstrai chamadas para API ou Nhost baseado no data provider
 *
 * Responsável por:
 * - Upload de imagens múltiplas
 * - Listagem de imagens por caso
 * - Remoção individual e em massa
 */

import { CaptureImage } from '@/types/capture';
import { getDataProvider } from './provider';
import { apiClient } from './apiClient';

const ENDPOINT = '/api/cases';

export class CaptureService {
  /**
   * Upload múltiplo de imagens para um caso
   */
  async uploadCaseImages(caseId: string, files: File[]): Promise<CaptureImage[]> {
    const provider = getDataProvider();

    // HTTP provider (default)
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    return apiClient.post<CaptureImage[]>(`${ENDPOINT}/${caseId}/images`, formData);
  }

  /**
   * Listar imagens de um caso
   */
  async listCaseImages(caseId: string): Promise<CaptureImage[]> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.get<CaptureImage[]>(`${ENDPOINT}/${caseId}/images`);
  }

  /**
   * Remover uma imagem específica
   */
  async deleteCaseImage(caseId: string, imageId: string, storagePath?: string): Promise<void> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.delete(`${ENDPOINT}/${caseId}/images/${imageId}`);
  }

  /**
   * Remover todas as imagens de um caso
   */
  async deleteCaseAllImages(caseId: string): Promise<void> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.delete(`${ENDPOINT}/${caseId}/images`);
  }
}

export const captureService = new CaptureService();
