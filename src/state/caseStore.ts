// =============================================================================
// CaseStore - Re-export wrapper for backward compatibility
// =============================================================================
// This file re-exports the modularized store from src/state/caseStore/ folder.
// All imports remain compatible with the original location.

export { useCaseStore, useSelectedCase, useFieldValue, useCaseProgress } from './caseStore/index';
export type { CaseStore } from './caseStore/types';
