// =============================================================================
// Photo Report Module - Tipos para Relatório Fotográfico
// =============================================================================

/**
 * Item individual no relatório fotográfico
 */
export interface PhotoReportItem {
  id: string; // UUID (pode ser o mesmo da imagem ou único)
  caseId: string; // ID do caso associado
  imageId: string; // ID da imagem capturada (referencia captureStore)
  caption: string; // Legenda/descrição da foto
  order: number; // Ordem de apresentação no relatório
  createdAt: string; // ISO date string
}

/**
 * Estado do store de Photo Report
 */
export interface PhotoReportState {
  // State
  itemsByCaseId: Record<string, PhotoReportItem[]>;

  // Actions
  getReport: (caseId: string) => PhotoReportItem[];
  addItem: (caseId: string, imageId: string) => void;
  updateItem: (caseId: string, itemId: string, patch: Partial<Omit<PhotoReportItem, 'id' | 'caseId' | 'imageId'>>) => void;
  removeItem: (caseId: string, itemId: string) => void;
  reorder: (caseId: string, orderedIds: string[]) => void;
  setReport: (caseId: string, items: PhotoReportItem[]) => void; // Para sincronizar com servidor
  clearCase: (caseId: string) => void; // Limpar tudo de um caso
}
