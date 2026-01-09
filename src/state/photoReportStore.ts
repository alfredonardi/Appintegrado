// =============================================================================
// Photo Report Module Store (Zustand + Persist)
// Integrado com photoReportService para multi-provider (mock, http, supabase)
// =============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PhotoReportItem, PhotoReportState } from '../types/photoReport';
import { photoReportService } from '../services/photoReportService';
import { isMockProvider } from '../services/provider';

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
 * Store global de Photo Report items
 * - Em modo mock: persistente com localStorage
 * - Em modo supabase: cache local + sincroniza com Supabase
 * - Em modo http: cache local
 */
export const usePhotoReportStore = create<PhotoReportState>()(
  persist(
    (set, get) => ({
      // Estado
      itemsByCaseId: {},

      // =========================================================================
      // Ações
      // =========================================================================

      /**
       * Retorna todos os itens do relatório de um caso
       */
      getReport: (caseId: string): PhotoReportItem[] => {
        const { itemsByCaseId } = get();
        return itemsByCaseId[caseId] || [];
      },

      /**
       * Adiciona uma imagem ao relatório fotográfico
       */
      addItem: (caseId: string, imageId: string) => {
        const state = get();
        const currentItems = state.itemsByCaseId[caseId] || [];

        // Verifica se já está no relatório
        if (currentItems.some((item) => item.imageId === imageId)) {
          console.warn('[PhotoReportStore] Imagem já está no relatório');
          return;
        }

        const newItem: PhotoReportItem = {
          id: generateId(),
          caseId,
          imageId,
          caption: '',
          order: currentItems.length,
          createdAt: new Date().toISOString(),
        };

        // Atualiza estado local
        set((state) => ({
          itemsByCaseId: {
            ...state.itemsByCaseId,
            [caseId]: [...currentItems, newItem],
          },
        }));

        // Sincroniza com serviço se não for mock
        if (!isMockProvider()) {
          syncAddItemViaService(caseId, imageId);
        }
      },

      /**
       * Atualiza um item do relatório (caption, etc)
       */
      updateItem: (caseId: string, itemId: string, patch: Partial<Omit<PhotoReportItem, 'id' | 'caseId' | 'imageId'>>) => {
        const state = get();
        const currentItems = state.itemsByCaseId[caseId] || [];
        const itemIndex = currentItems.findIndex((item) => item.id === itemId);

        if (itemIndex === -1) {
          console.warn(`[PhotoReportStore] Item não encontrado: ${itemId}`);
          return;
        }

        const updatedItem = {
          ...currentItems[itemIndex],
          ...patch,
        };

        // Atualiza estado local
        const updatedItems = [...currentItems];
        updatedItems[itemIndex] = updatedItem;

        set((state) => ({
          itemsByCaseId: {
            ...state.itemsByCaseId,
            [caseId]: updatedItems,
          },
        }));

        // Sincroniza com serviço se não for mock
        if (!isMockProvider()) {
          syncUpdateItemViaService(caseId, itemId, patch);
        }
      },

      /**
       * Remove um item do relatório
       */
      removeItem: (caseId: string, itemId: string) => {
        const state = get();
        const currentItems = state.itemsByCaseId[caseId] || [];
        const itemToRemove = currentItems.find((item) => item.id === itemId);

        if (!itemToRemove) {
          console.warn(`[PhotoReportStore] Item não encontrado: ${itemId}`);
          return;
        }

        // Remove do estado local primeiro (optimistic update)
        set((state) => ({
          itemsByCaseId: {
            ...state.itemsByCaseId,
            [caseId]: currentItems.filter((item) => item.id !== itemId),
          },
        }));

        // Sincroniza com serviço se não for mock
        if (!isMockProvider()) {
          syncRemoveItemViaService(caseId, itemId);
        }
      },

      /**
       * Reordena itens do relatório
       */
      reorder: (caseId: string, orderedIds: string[]) => {
        const state = get();
        const currentItems = state.itemsByCaseId[caseId] || [];

        // Reconstrói array com nova ordem
        const reorderedItems = orderedIds
          .map((id) => currentItems.find((item) => item.id === id))
          .filter((item): item is PhotoReportItem => item !== undefined)
          .map((item, index) => ({
            ...item,
            order: index,
          }));

        set((state) => ({
          itemsByCaseId: {
            ...state.itemsByCaseId,
            [caseId]: reorderedItems,
          },
        }));

        // Sincroniza com serviço se não for mock
        if (!isMockProvider()) {
          syncReorderViaService(caseId, orderedIds);
        }
      },

      /**
       * Define os itens do relatório (usado para sincronizar com servidor)
       */
      setReport: (caseId: string, items: PhotoReportItem[]) => {
        set((state) => ({
          itemsByCaseId: {
            ...state.itemsByCaseId,
            [caseId]: items,
          },
        }));
      },

      /**
       * Limpa todos os itens de um caso
       */
      clearCase: (caseId: string) => {
        set((state) => ({
          itemsByCaseId: {
            ...state.itemsByCaseId,
            [caseId]: [],
          },
        }));

        // Sincroniza com serviço se não for mock
        if (!isMockProvider()) {
          syncClearViaService(caseId);
        }
      },
    }),
    {
      name: 'appintegrado-photo-report',
      storage: createJSONStorage(() => localStorage),
      // Em modo Supabase, o cache local persiste para disponibilidade offline
      // Os dados reais estão no Supabase
    }
  )
);

// ============================================================================
// Helpers privados para sincronização com serviço
// ============================================================================

/**
 * Sincroniza adição de item via serviço
 */
function syncAddItemViaService(caseId: string, imageId: string) {
  photoReportService
    .add(caseId, imageId)
    .catch((error) => {
      console.error('[PhotoReportStore] Erro ao adicionar item:', error);
    });
}

/**
 * Sincroniza atualização de item via serviço
 */
function syncUpdateItemViaService(caseId: string, itemId: string, patch: any) {
  photoReportService
    .update(caseId, itemId, patch)
    .catch((error) => {
      console.error('[PhotoReportStore] Erro ao atualizar item:', error);
    });
}

/**
 * Sincroniza remoção de item via serviço
 */
function syncRemoveItemViaService(caseId: string, itemId: string) {
  photoReportService
    .remove(caseId, itemId)
    .catch((error) => {
      console.error('[PhotoReportStore] Erro ao remover item:', error);
    });
}

/**
 * Sincroniza reordenação via serviço
 */
function syncReorderViaService(caseId: string, orderedIds: string[]) {
  photoReportService
    .reorder(caseId, orderedIds)
    .catch((error) => {
      console.error('[PhotoReportStore] Erro ao reordenar itens:', error);
    });
}

/**
 * Sincroniza limpeza via serviço
 */
function syncClearViaService(caseId: string) {
  photoReportService
    .list(caseId)
    .then((items) => {
      // Remove todos os itens
      const itemIds = items.map((item) => item.id);
      return Promise.all(itemIds.map((id) => photoReportService.remove(caseId, id)));
    })
    .catch((error) => {
      console.error('[PhotoReportStore] Erro ao limpar caso:', error);
    });
}
