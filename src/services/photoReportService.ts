/**
 * Photo Report Service
 * Abstrai chamadas para API ou Nhost baseado no data provider
 *
 * Responsável por:
 * - Listar itens do relatório fotográfico
 * - Adicionar imagens ao relatório
 * - Atualizar itens (caption, etc)
 * - Remover itens
 * - Reordenar itens
 */

import { PhotoReportItem } from '@/types/photoReport';
import { getDataProvider } from './provider';
import { apiClient } from './apiClient';

const ENDPOINT = '/api/cases';

export class PhotoReportService {
  /**
   * Listar todos os itens do relatório de um caso
   */
  async list(caseId: string): Promise<PhotoReportItem[]> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.get<PhotoReportItem[]>(`${ENDPOINT}/${caseId}/photo-report`);
  }

  /**
   * Adicionar uma imagem ao relatório
   */
  async add(caseId: string, imageId: string): Promise<PhotoReportItem> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.post<PhotoReportItem>(`${ENDPOINT}/${caseId}/photo-report`, {
      imageId,
    });
  }

  /**
   * Atualizar um item (caption, etc)
   */
  async update(caseId: string, itemId: string, patch: Partial<Omit<PhotoReportItem, 'id' | 'caseId' | 'imageId'>>): Promise<PhotoReportItem> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.patch<PhotoReportItem>(`${ENDPOINT}/${caseId}/photo-report/${itemId}`, patch);
  }

  /**
   * Remover um item
   */
  async remove(caseId: string, itemId: string): Promise<void> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.delete(`${ENDPOINT}/${caseId}/photo-report/${itemId}`);
  }

  /**
   * Reordenar itens
   */
  async reorder(caseId: string, orderedIds: string[]): Promise<void> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.post<void>(`${ENDPOINT}/${caseId}/photo-report/reorder`, {
      orderedIds,
    });
  }
}

export const photoReportService = new PhotoReportService();
