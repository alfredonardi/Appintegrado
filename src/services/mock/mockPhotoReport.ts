/**
 * Mock Photo Report Service
 * Mantém dados em memória para desenvolvimento sem backend
 */

import { PhotoReportItem } from '@/types/photoReport';

/**
 * Mock data: armazena itens do relatório por caso
 */
const mockReportItemsByCaseId: Record<string, PhotoReportItem[]> = {};

/**
 * Gera um UUID simples
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Listar todos os itens do relatório de um caso
 */
export function mockListPhotoReport(caseId: string): PhotoReportItem[] {
  return mockReportItemsByCaseId[caseId] || [];
}

/**
 * Adicionar uma imagem ao relatório
 */
export function mockAddPhotoReportItem(caseId: string, imageId: string): PhotoReportItem {
  const items = mockReportItemsByCaseId[caseId] || [];

  // Verifica duplicata
  if (items.some((item) => item.imageId === imageId)) {
    throw new Error('Imagem já está no relatório');
  }

  const newItem: PhotoReportItem = {
    id: generateId(),
    caseId,
    imageId,
    caption: '',
    order: items.length,
    createdAt: new Date().toISOString(),
  };

  mockReportItemsByCaseId[caseId] = [...items, newItem];
  return newItem;
}

/**
 * Atualizar um item
 */
export function mockUpdatePhotoReportItem(
  caseId: string,
  itemId: string,
  patch: Partial<Omit<PhotoReportItem, 'id' | 'caseId' | 'imageId'>>
): PhotoReportItem {
  const items = mockReportItemsByCaseId[caseId] || [];
  const itemIndex = items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    throw new Error('Item não encontrado');
  }

  const updatedItem = {
    ...items[itemIndex],
    ...patch,
  };

  const updatedItems = [...items];
  updatedItems[itemIndex] = updatedItem;
  mockReportItemsByCaseId[caseId] = updatedItems;

  return updatedItem;
}

/**
 * Remover um item
 */
export function mockRemovePhotoReportItem(caseId: string, itemId: string): void {
  const items = mockReportItemsByCaseId[caseId] || [];
  const filtered = items.filter((item) => item.id !== itemId);
  mockReportItemsByCaseId[caseId] = filtered;
}

/**
 * Reordenar itens
 */
export function mockReorderPhotoReportItems(caseId: string, orderedIds: string[]): void {
  const items = mockReportItemsByCaseId[caseId] || [];

  // Reconstrói array com nova ordem
  const reorderedItems = orderedIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is PhotoReportItem => item !== undefined)
    .map((item, index) => ({
      ...item,
      order: index,
    }));

  mockReportItemsByCaseId[caseId] = reorderedItems;
}
