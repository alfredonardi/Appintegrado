// =============================================================================
// CaseStore Helpers - Shared utilities for slices
// =============================================================================

import { Case, FieldValue, AuditEvent, AuditEventType } from '../../types/case';
import { v4 as uuidv4 } from 'uuid';
import { CaseStore } from './types';

/**
 * Get selected case or throw error
 */
export const getSelectedCaseOrThrow = (state: CaseStore): Case => {
  const selectedCase = state.selectedCase();
  if (!selectedCase) throw new Error('No case selected');
  return selectedCase;
};

/**
 * Find case by ID
 */
export const findCaseById = (cases: Case[], caseId: string): Case | undefined => {
  return cases.find((c) => c.id === caseId);
};

/**
 * Update selected case in cases array
 */
export const updateSelectedCaseInArray = (
  cases: Case[],
  caseId: string | null,
  updates: Partial<Case>
): Case[] => {
  if (!caseId) return cases;
  return cases.map((c) =>
    c.id === caseId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
  );
};

/**
 * Create field value object
 */
export const createFieldValue = (
  key: string,
  value: string,
  status: 'confirmed' | 'suggested' | 'edited',
  sources: string[] = ['Manual'],
  confidence?: number,
  updatedBy: string = 'Sistema'
): FieldValue => {
  return {
    key,
    value,
    status,
    confidence,
    sources,
    lastUpdated: new Date().toISOString(),
    updatedBy,
  };
};

/**
 * Create audit event
 */
export const createAuditEvent = (
  type: AuditEventType,
  details: Record<string, unknown>,
  user: string = 'Sistema'
): AuditEvent => {
  return {
    id: uuidv4(),
    type,
    timestamp: new Date().toISOString(),
    user,
    details,
  };
};

/**
 * Find field value in case
 */
export const findFieldInCase = (selectedCase: Case, key: string): FieldValue | undefined => {
  return selectedCase.fieldValues.find((f) => f.key === key);
};

/**
 * Update field value in case
 */
export const updateFieldInCase = (
  selectedCase: Case,
  key: string,
  value: string,
  status: 'confirmed' | 'suggested' | 'edited',
  sources: string[] = [],
  confidence?: number,
  updatedBy: string = 'Sistema'
): FieldValue[] => {
  const newFieldValue = createFieldValue(key, value, status, sources, confidence, updatedBy);
  const existingIndex = selectedCase.fieldValues.findIndex((f) => f.key === key);

  if (existingIndex >= 0) {
    const newFieldValues = [...selectedCase.fieldValues];
    newFieldValues[existingIndex] = newFieldValue;
    return newFieldValues;
  } else {
    return [...selectedCase.fieldValues, newFieldValue];
  }
};
