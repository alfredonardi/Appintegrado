// =============================================================================
// Capture Module Store (Zustand + Persist)
// Integrado com captureService para multi-provider (mock, http, supabase)
// =============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CaptureImage, CaptureState } from '../types/capture';
import { captureService } from '../services/captureService';
import { isMockProvider, isSupabaseProvider } from '../services/provider';

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
 * Store global de Capture images
 * - Em modo mock: persistente com localStorage (Data URLs)
 * - Em modo supabase: cache local + sincroniza com Supabase Storage
 * - Em modo http: cache local
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
       * Retorna imagens de um caso específico (do cache local)
       */
      getImages: (caseId: string): CaptureImage[] => {
        const { imagesByCaseId } = get();
        return imagesByCaseId[caseId] || [];
      },

      /**
       * Adiciona múltiplas imagens a um caso
       * - Mock mode: Converte para Data URLs para persistência no localStorage
       * - Supabase mode: Upload para bucket case-images, retorna URLs públicas
       * - HTTP mode: Envia para API backend
       */
      addImages: (caseId: string, files: File[]) => {
        // Validar que temos arquivos
        if (!files || files.length === 0) {
          console.warn('[CaptureStore] Nenhum arquivo selecionado');
          return;
        }

        // Processa baseado no provider
        if (isMockProvider()) {
          // Mock mode: converte para Data URLs localmente
          addImagesToMockMode(caseId, files, set, get);
        } else {
          // Supabase ou HTTP mode: usa o serviço
          addImagesToServiceMode(caseId, files, set);
        }
      },

      /**
       * Remove uma imagem de um caso
       * - Mock mode: Remove do estado local
       * - Supabase mode: Remove do Storage e do estado local
       * - HTTP mode: Chama API backend
       */
      removeImage: (caseId: string, imageId: string) => {
        const state = get();
        const currentImages = state.imagesByCaseId[caseId] || [];
        const imageToRemove = currentImages.find((img) => img.id === imageId);

        if (!imageToRemove) {
          console.warn(`[CaptureStore] Imagem não encontrada: ${imageId}`);
          return;
        }

        // Remove do estado local primeiro (otimistic update)
        set((state) => ({
          imagesByCaseId: {
            ...state.imagesByCaseId,
            [caseId]: currentImages.filter((img) => img.id !== imageId),
          },
        }));

        // Chama o serviço se não for mock (mock já foi removido acima)
        if (!isMockProvider()) {
          removeImageViaService(caseId, imageId, imageToRemove);
        }
      },

      /**
       * Limpa todas as imagens de um caso
       */
      clearCaseImages: (caseId: string) => {
        set((state) => ({
          imagesByCaseId: {
            ...state.imagesByCaseId,
            [caseId]: [],
          },
        }));

        // Chama o serviço se não for mock
        if (!isMockProvider()) {
          captureService
            .deleteCaseAllImages(caseId)
            .catch((error) => console.error('[CaptureStore] Erro ao limpar imagens:', error));
        }
      },

      /**
       * Define as imagens de um caso (usado para sincronizar com servidor)
       * Útil para carregar imagens do Supabase ao montar
       */
      setImages: (caseId: string, images: CaptureImage[]) => {
        set((state) => ({
          imagesByCaseId: {
            ...state.imagesByCaseId,
            [caseId]: images,
          },
        }));
      },
    }),
    {
      name: 'atlas-capture',
      storage: createJSONStorage(() => localStorage),
      // Em modo Supabase, o cache local persiste para disponibilidade offline
      // Os dados reais estão no Supabase Storage
    }
  )
);

// ============================================================================
// Helpers privados para adicionar imagens
// ============================================================================

/**
 * Adiciona imagens em modo mock (converte para Data URLs)
 */
function addImagesToMockMode(
  caseId: string,
  files: File[],
  set: any,
  get: any
) {
  let processedCount = 0;
  const filesToProcess = files.filter((file) => {
    if (!file.type.startsWith('image/')) {
      console.warn(`[CaptureStore] Arquivo ignorado (não é imagem): ${file.name}`);
      return false;
    }
    return true;
  });

  if (filesToProcess.length === 0) {
    console.warn('[CaptureStore] Nenhuma imagem válida para processar');
    return;
  }

  for (const file of filesToProcess) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      const captureImage: CaptureImage = {
        id: generateId(),
        caseId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: dataUrl,
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
      console.error(`[CaptureStore] Erro ao ler arquivo: ${file.name}`);
      processedCount++;
    };

    reader.readAsDataURL(file);
  }
}

/**
 * Adiciona imagens via serviço (Supabase ou HTTP)
 * Atualiza o estado local com as imagens retornadas pelo serviço
 */
function addImagesToServiceMode(caseId: string, files: File[], set: any) {
  captureService
    .uploadCaseImages(caseId, files)
    .then((uploadedImages) => {
      if (uploadedImages && uploadedImages.length > 0) {
        set((state) => ({
          imagesByCaseId: {
            ...state.imagesByCaseId,
            [caseId]: [...(state.imagesByCaseId[caseId] || []), ...uploadedImages],
          },
        }));
      }
    })
    .catch((error) => {
      console.error('[CaptureStore] Erro ao fazer upload de imagens:', error);
      // Erro será exibido na UI pelo componente
    });
}

/**
 * Remove uma imagem via serviço (Supabase ou HTTP)
 */
function removeImageViaService(caseId: string, imageId: string, image: CaptureImage) {
  // Supabase precisa do storagePath, mas como não armazenamos, reconstroímos
  // Formato do storagePath em Supabase: cases/{caseId}/{imageId}-{fileName}
  const storagePath = `cases/${caseId}/${imageId}-${image.name}`;

  captureService
    .deleteCaseImage(caseId, imageId, storagePath)
    .catch((error) => {
      console.error('[CaptureStore] Erro ao remover imagem:', error);
      // Nota: A imagem já foi removida do estado local (optimistic update)
      // Se o serviço falhar, o usuário verá que foi removida localmente
    });
}
