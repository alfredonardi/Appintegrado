// =============================================================================
// Investigation Report Slice
// =============================================================================

import { ReportSignatures } from '../../../types/case';
import { CaseStore } from '../types';
import { StateCreator } from 'zustand';

export interface InvestigationReportSlice {
  updateReportBlock: (blockId: string, content: string, referencedFieldKeys?: string[], referencedPhotoIds?: string[]) => void;
  setBlockAIGenerated: (blockId: string, content: string) => void;
  confirmBlockContent: (blockId: string) => void;
  setReportSignatures: (signatures: Partial<ReportSignatures>) => void;
}

export const createInvestigationReportSlice: StateCreator<CaseStore, [], [], InvestigationReportSlice> = (set, get) => ({
  updateReportBlock: (blockId, content, referencedFieldKeys = [], referencedPhotoIds = []) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              investigationReport: {
                ...c.investigationReport,
                blocks: c.investigationReport.blocks.map((b) =>
                  b.id === blockId
                    ? {
                        ...b,
                        content,
                        referencedFieldKeys,
                        referencedPhotoIds,
                        status: content.length > 0 ? 'draft' : 'empty',
                        lastUpdated: new Date().toISOString(),
                      }
                    : b
                ),
                lastUpdated: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));

    get().addAuditEvent('BLOCK_UPDATED', { blockId, contentLength: content.length });
  },

  setBlockAIGenerated: (blockId, content) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              investigationReport: {
                ...c.investigationReport,
                blocks: c.investigationReport.blocks.map((b) =>
                  b.id === blockId
                    ? {
                        ...b,
                        content,
                        status: 'ai_generated',
                        aiGenerated: true,
                        lastUpdated: new Date().toISOString(),
                      }
                    : b
                ),
                lastUpdated: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));

    get().addAuditEvent('BLOCK_AI_GENERATED', { blockId });
  },

  confirmBlockContent: (blockId) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              investigationReport: {
                ...c.investigationReport,
                blocks: c.investigationReport.blocks.map((b) =>
                  b.id === blockId ? { ...b, status: 'confirmed', lastUpdated: new Date().toISOString() } : b
                ),
                lastUpdated: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },

  setReportSignatures: (signatures) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              investigationReport: {
                ...c.investigationReport,
                signatures: { ...c.investigationReport.signatures, ...signatures },
                lastUpdated: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },
});
