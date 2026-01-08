// =============================================================================
// AI Slice - AI extractions management
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { AIExtraction } from '../../../types/case';
import { CaseStore } from '../types';
import { StateCreator } from 'zustand';

export interface AISlice {
  addAIExtraction: (extraction: Omit<AIExtraction, 'id' | 'createdAt'>) => string;
  confirmAIExtraction: (extractionId: string) => void;
  dismissAIExtraction: (extractionId: string) => void;
  getPendingExtractions: () => AIExtraction[];
}

export const createAISlice: StateCreator<CaseStore, [], [], AISlice> = (set, get) => ({
  addAIExtraction: (extraction) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return '';

    const id = uuidv4();
    const newExtraction: AIExtraction = {
      ...extraction,
      id,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, aiExtractions: [...c.aiExtractions, newExtraction], updatedAt: new Date().toISOString() }
          : c
      ),
    }));

    // Adiciona também como FieldValue sugerido
    get().setFieldValue(
      extraction.fieldKey,
      extraction.suggestedValue,
      'suggested',
      extraction.sourceEvidenceIds.map((id) => `Foto ${id}`),
      extraction.confidence
    );

    return id;
  },

  confirmAIExtraction: (extractionId) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    const extraction = selectedCase.aiExtractions.find((e) => e.id === extractionId);
    if (!extraction) return;

    // Atualiza status da extração
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              aiExtractions: c.aiExtractions.map((e) =>
                e.id === extractionId ? { ...e, status: 'confirmed' as const } : e
              ),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));

    // Confirma o campo
    get().confirmField(extraction.fieldKey);
  },

  dismissAIExtraction: (extractionId) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              aiExtractions: c.aiExtractions.map((e) =>
                e.id === extractionId ? { ...e, status: 'dismissed' as const } : e
              ),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));

    get().addAuditEvent('FIELD_DISMISSED', { extractionId });
  },

  getPendingExtractions: () => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return [];
    return selectedCase.aiExtractions.filter((e) => e.status === 'pending');
  },
});
