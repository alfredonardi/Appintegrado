// =============================================================================
// Cases Slice
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { Case, createEmptyCase, CaseStatus } from '../../../types/case';
import { CaseStore } from '../types';
import { updateSelectedCaseInArray, createFieldValue, createAuditEvent } from '../helpers';
import { StateCreator } from 'zustand';

export interface CasesSlice {
  selectedCase: () => Case | null;
  createCase: (bo: string, natureza?: string) => string;
  selectCase: (caseId: string | null) => void;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  deleteCase: (caseId: string) => void;
  setCaseStatus: (caseId: string, status: CaseStatus) => void;
}

export const createCasesSlice: StateCreator<CaseStore, [], [], CasesSlice> = (set, get) => ({
  selectedCase: () => {
    const { cases, selectedCaseId } = get();
    return cases.find((c) => c.id === selectedCaseId) || null;
  },

  createCase: (bo: string, natureza?: string) => {
    const id = uuidv4();
    const newCase = createEmptyCase(id, bo);
    if (natureza) newCase.natureza = natureza;

    // Adiciona campos canônicos iniciais
    newCase.fieldValues = [
      createFieldValue('case.bo', bo, 'confirmed', ['Manual'], undefined, get().currentUser),
    ];
    if (natureza) {
      newCase.fieldValues.push(
        createFieldValue('case.natureza', natureza, 'confirmed', ['Manual'], undefined, get().currentUser)
      );
    }

    newCase.auditLog.push(
      createAuditEvent('CASE_CREATED', { bo, natureza }, get().currentUser)
    );

    set((state) => ({ cases: [...state.cases, newCase] }));
    return id;
  },

  selectCase: (caseId: string | null) => {
    set({ selectedCaseId: caseId });
  },

  updateCase: (caseId: string, updates: Partial<Case>) => {
    set((state) => ({
      cases: updateSelectedCaseInArray(state, caseId, updates),
    }));
  },

  deleteCase: (caseId: string) => {
    set((state) => ({
      cases: state.cases.filter((c) => c.id !== caseId),
      selectedCaseId: state.selectedCaseId === caseId ? null : state.selectedCaseId,
    }));
  },

  setCaseStatus: (caseId: string, status: CaseStatus) => {
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId ? { ...c, status, updatedAt: new Date().toISOString() } : c
      ),
    }));
  },
});
