/**
 * Photo Report Service
 * Usa exclusivamente Nhost como backend
 *
 * Responsável por:
 * - Listar itens do relatório fotográfico
 * - Adicionar imagens ao relatório
 * - Atualizar itens (caption, etc)
 * - Remover itens
 * - Reordenar itens
 */

import { PhotoReportItem } from '@/types/photoReport';

export class PhotoReportService {
  /**
   * Listar todos os itens do relatório de um caso
   */
  async list(caseId: string): Promise<PhotoReportItem[]> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Adicionar uma imagem ao relatório
   */
  async add(caseId: string, imageId: string): Promise<PhotoReportItem> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Atualizar um item (caption, etc)
   */
  async update(caseId: string, itemId: string, patch: Partial<Omit<PhotoReportItem, 'id' | 'caseId' | 'imageId'>>): Promise<PhotoReportItem> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Remover um item
   */
  async remove(caseId: string, itemId: string): Promise<void> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Reordenar itens
   */
  async reorder(caseId: string, orderedIds: string[]): Promise<void> {
    throw new Error('Nhost implementation not yet available for this service');
  }
}

export const photoReportService = new PhotoReportService();
