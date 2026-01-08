/**
 * Store de Casos - Zustand
 * Gerencia estado global de casos para CRUD
 * Complementa caseStore.ts (que gerencia um caso aberto)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Case, createEmptyCase } from '@/types/case';
import { casesService } from '@/services/casesService';
import { v4 as uuidv4 } from 'uuid';

interface CasesStore {
  // Estado
  cases: Case[];
  selectedCaseId: string | null;
  loading: boolean;

  // Seletores
  selectedCase: () => Case | null;
  getCaseById: (id: string) => Case | undefined;

  // Actions - Listar
  fetchCases: () => Promise<void>;

  // Actions - CRUD
  createCase: (
    bo: string,
    natureza?: string,
    endereco?: string,
    dataHoraFato?: string
  ) => Promise<Case>;
  selectCase: (caseId: string | null) => void;
  updateCase: (caseId: string, updates: Partial<Case>) => Promise<Case>;
  deleteCase: (caseId: string) => Promise<void>;

  // Actions - Utilitários
  setLoading: (loading: boolean) => void;
  clearCases: () => void;
}

/**
 * Store Zustand com persistência em localStorage
 * Foca em CRUD básico de casos
 */
export const useCasesStore = create<CasesStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      cases: [],
      selectedCaseId: null,
      loading: false,

      // Seletor: caso selecionado
      selectedCase: () => {
        const { cases, selectedCaseId } = get();
        if (!selectedCaseId) return null;
        return cases.find((c) => c.id === selectedCaseId) || null;
      },

      // Seletor: caso por ID
      getCaseById: (id: string) => {
        return get().cases.find((c) => c.id === id);
      },

      // Action: buscar todos os casos
      fetchCases: async () => {
        set({ loading: true });
        try {
          const cases = await casesService.getCases();
          set({ cases });
        } catch (error) {
          console.error('Erro ao buscar casos:', error);
        } finally {
          set({ loading: false });
        }
      },

      // Action: criar novo caso
      createCase: async (bo, natureza, endereco, dataHoraFato) => {
        set({ loading: true });
        try {
          // Cria localmente primeiro
          const id = uuidv4();
          const newCase = createEmptyCase(id, bo);
          if (natureza) newCase.natureza = natureza;
          if (endereco) newCase.endereco = endereco;
          if (dataHoraFato) newCase.dataHoraFato = dataHoraFato;

          // Tenta persistir via serviço
          let persistedCase = newCase;
          try {
            persistedCase = await casesService.createCase(bo);
            // Copia dados adicionais para caso persistido
            if (natureza) persistedCase.natureza = natureza;
            if (endereco) persistedCase.endereco = endereco;
            if (dataHoraFato) persistedCase.dataHoraFato = dataHoraFato;
          } catch (error) {
            console.warn('Erro ao persistir caso no serviço, usando local:', error);
          }

          set((state) => ({
            cases: [...state.cases, persistedCase],
          }));
          return persistedCase;
        } catch (error) {
          console.error('Erro ao criar caso:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Action: selecionar caso
      selectCase: (caseId) => {
        set({ selectedCaseId: caseId });
      },

      // Action: atualizar caso
      updateCase: async (caseId, updates) => {
        set({ loading: true });
        try {
          const updatedCase = await casesService.updateCase(caseId, updates);
          set((state) => ({
            cases: state.cases.map((c) => (c.id === caseId ? updatedCase : c)),
          }));
          return updatedCase;
        } catch (error) {
          console.error('Erro ao atualizar caso:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Action: deletar caso
      deleteCase: async (caseId) => {
        set({ loading: true });
        try {
          await casesService.deleteCase(caseId);
          set((state) => ({
            cases: state.cases.filter((c) => c.id !== caseId),
            selectedCaseId:
              state.selectedCaseId === caseId ? null : state.selectedCaseId,
          }));
        } catch (error) {
          console.error('Erro ao deletar caso:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Action: definir loading
      setLoading: (loading) => {
        set({ loading });
      },

      // Action: limpar casos
      clearCases: () => {
        set({ cases: [], selectedCaseId: null });
      },
    }),
    {
      name: 'cases-store',
      storage: createJSONStorage(() => localStorage),
      // Persistir apenas casos (não carregamos dados do localStorage inicialmente)
      partialize: (state) => ({ cases: state.cases }),
    }
  )
);
