// =============================================================================
// Photo Report Slice
// =============================================================================

import { SelectedPhoto } from '../../../types/case';
import { CaseStore } from '../types';
import { StateCreator } from 'zustand';

export interface PhotoReportSlice {
  setPhotoReportSelection: (photos: SelectedPhoto[]) => void;
  updatePhotoCaption: (photoId: string, caption: string) => void;
  setPhotoReportLayout: (layout: '1-per-page' | '2-per-page') => void;
  setPhotoReportOptions: (options: { includeCover?: boolean; includeHeaderFooter?: boolean }) => void;
}

export const createPhotoReportSlice: StateCreator<CaseStore, [], [], PhotoReportSlice> = (set, get) => ({
  setPhotoReportSelection: (photos) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              photoReport: {
                ...c.photoReport,
                selectedPhotos: photos,
                lastUpdated: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },

  updatePhotoCaption: (photoId, caption) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              photoReport: {
                ...c.photoReport,
                selectedPhotos: c.photoReport.selectedPhotos.map((p) =>
                  p.photoId === photoId ? { ...p, caption } : p
                ),
                lastUpdated: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },

  setPhotoReportLayout: (layout) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              photoReport: { ...c.photoReport, layout, lastUpdated: new Date().toISOString() },
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },

  setPhotoReportOptions: (options) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              photoReport: { ...c.photoReport, ...options, lastUpdated: new Date().toISOString() },
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },
});
