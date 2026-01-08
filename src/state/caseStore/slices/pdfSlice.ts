// =============================================================================
// PDF Slice - PDF/Export functionality
// =============================================================================

import { CaseStore } from '../types';
import { StateCreator } from 'zustand';

export interface PDFSlice {
  addGeneratedPDF: (pdf: { type: 'recognition' | 'photo-report' | 'investigation'; fileName: string; base64?: string }) => void;
}

export const createPDFSlice: StateCreator<CaseStore, [], [], PDFSlice> = (set, get) => ({
  addGeneratedPDF: (pdf) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    const newPDF = {
      ...pdf,
      generatedAt: new Date().toISOString(),
      generatedBy: get().currentUser,
    };

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, generatedPDFs: [...c.generatedPDFs, newPDF], updatedAt: new Date().toISOString() }
          : c
      ),
    }));

    get().addAuditEvent('PDF_GENERATED', { type: pdf.type, fileName: pdf.fileName });
  },
});
