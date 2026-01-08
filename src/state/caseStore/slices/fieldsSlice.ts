// =============================================================================
// Fields Slice - Canonical field values
// =============================================================================

import { FieldValue, FieldStatus } from '../../../types/case';
import { CaseStore } from '../types';
import { updateSelectedCaseInArray, createFieldValue, updateFieldInCase, findFieldInCase } from '../helpers';
import { StateCreator } from 'zustand';

export interface FieldsSlice {
  setFieldValue: (
    key: string,
    value: string,
    status: FieldStatus,
    sources?: string[],
    confidence?: number
  ) => void;
  confirmField: (key: string) => void;
  editField: (key: string, newValue: string) => void;
  getFieldValue: (key: string) => FieldValue | undefined;
  getConfirmedFields: () => FieldValue[];
}

export const createFieldsSlice: StateCreator<CaseStore, [], [], FieldsSlice> = (set, get) => ({
  setFieldValue: (key, value, status, sources = ['Manual'], confidence) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    const newFieldValues = updateFieldInCase(
      selectedCase,
      key,
      value,
      status as any,
      sources,
      confidence,
      status === 'suggested' ? 'IA' : get().currentUser
    );

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, fieldValues: newFieldValues, updatedAt: new Date().toISOString() }
          : c
      ),
    }));

    // Adiciona evento de auditoria
    get().addAuditEvent(
      status === 'suggested' ? 'AI_SUGGESTED' : status === 'confirmed' ? 'FIELD_CONFIRMED' : 'FIELD_EDITED',
      { key, value, status, confidence }
    );
  },

  confirmField: (key: string) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    const field = findFieldInCase(selectedCase, key);
    if (!field) return;

    get().setFieldValue(key, field.value, 'confirmed', field.sources, field.confidence);
  },

  editField: (key: string, newValue: string) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    const field = findFieldInCase(selectedCase, key);
    const sources = field ? [...field.sources, 'Editado manualmente'] : ['Manual'];

    get().setFieldValue(key, newValue, 'edited', sources);
  },

  getFieldValue: (key: string) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return undefined;
    return findFieldInCase(selectedCase, key);
  },

  getConfirmedFields: () => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return [];
    return selectedCase.fieldValues.filter((f) => f.status === 'confirmed' || f.status === 'edited');
  },
});
