// =============================================================================
// Capture Module - Tipos para Captura de Imagens
// =============================================================================

/**
 * Representa uma imagem capturada/enviada
 */
export interface CaptureImage {
  id: string; // UUID gerado com crypto.randomUUID()
  caseId: string; // ID do caso associado
  name: string; // Nome original do arquivo
  size: number; // Tamanho em bytes
  type: string; // MIME type (image/png, image/jpeg, image/webp)
  url: string; // Object URL ou Data URL para preview
  createdAt: string; // ISO date string
}

/**
 * Estado do store de Capture
 */
export interface CaptureState {
  imagesByCaseId: Record<string, CaptureImage[]>; // Imagens organizadas por caso

  // Ações
  getImages: (caseId: string) => CaptureImage[];
  addImages: (caseId: string, files: File[]) => void;
  removeImage: (caseId: string, imageId: string) => void;
  clearCaseImages: (caseId: string) => void;
}
