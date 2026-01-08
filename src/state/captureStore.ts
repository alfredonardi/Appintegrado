// =============================================================================
// Capture Module Store (Zustand + Persist)
// =============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CaptureImage, CaptureState } from '../types/capture';

/**
 * Gera um UUID simples (fallback se crypto.randomUUID não estiver disponível)
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para navegadores antigos
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Store global de Capture images (persistente com localStorage)
 */
export const useCaptureStore = create<CaptureState>()(
  persist(
    (set, get) => ({
      // Estado
      imagesByCaseId: {},

      // =========================================================================
      // Ações
      // =========================================================================

      /**
       * Retorna imagens de um caso específico
       */
      getImages: (caseId: string): CaptureImage[] => {
        const { imagesByCaseId } = get();
        return imagesByCaseId[caseId] || [];
      },

      /**
       * Adiciona múltiplas imagens a um caso
       * Converte para Data URLs (base64) para persistência no localStorage
       * Executa assincronamente sem bloquear a UI
       */
      addImages: (caseId: string, files: File[]) => {
        const currentImages = get().imagesByCaseId[caseId] || [];
        let processedCount = 0;

        for (const file of files) {
          // Validar se é imagem
          if (!file.type.startsWith('image/')) {
            console.warn(`Arquivo ignorado (não é imagem): ${file.name}`);
            continue;
          }

          const reader = new FileReader();

          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;

            const captureImage: CaptureImage = {
              id: generateId(),
              caseId,
              name: file.name,
              size: file.size,
              type: file.type,
              url: dataUrl, // Data URL (base64)
              createdAt: new Date().toISOString(),
            };

            set((state) => ({
              imagesByCaseId: {
                ...state.imagesByCaseId,
                [caseId]: [...(state.imagesByCaseId[caseId] || []), captureImage],
              },
            }));

            processedCount++;
          };

          reader.onerror = () => {
            console.error(`Erro ao ler arquivo: ${file.name}`);
            processedCount++;
          };

          reader.readAsDataURL(file);
        }
      },

      /**
       * Remove uma imagem de um caso
       * Data URLs não precisam de revogação (não ocupam memória como blob URLs)
       */
      removeImage: (caseId: string, imageId: string) => {
        set((state) => {
          const currentImages = state.imagesByCaseId[caseId] || [];

          return {
            imagesByCaseId: {
              ...state.imagesByCaseId,
              [caseId]: currentImages.filter((img) => img.id !== imageId),
            },
          };
        });
      },

      /**
       * Limpa todas as imagens de um caso (opcional)
       */
      clearCaseImages: (caseId: string) => {
        set((state) => {
          return {
            imagesByCaseId: {
              ...state.imagesByCaseId,
              [caseId]: [],
            },
          };
        });
      },
    }),
    {
      name: 'appintegrado-capture', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Nota: Usa Data URLs (base64) para persistência no localStorage
      // Data URLs são válidos após reload mas podem consumir mais espaço
    }
  )
);
