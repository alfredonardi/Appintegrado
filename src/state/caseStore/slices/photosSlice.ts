// =============================================================================
// Photos Slice
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { PhotoEvidence, PhotoCategory } from '../../../types/case';
import { CaseStore } from '../types';
import { StateCreator } from 'zustand';

export interface PhotosSlice {
  addPhoto: (photo: Omit<PhotoEvidence, 'id' | 'createdAt'>) => string;
  updatePhoto: (photoId: string, updates: Partial<PhotoEvidence>) => void;
  deletePhoto: (photoId: string) => void;
  confirmPhotoCategory: (photoId: string, category: PhotoCategory) => void;
}

export const createPhotosSlice: StateCreator<CaseStore, [], [], PhotosSlice> = (set, get) => ({
  addPhoto: (photo) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return '';

    const id = uuidv4();
    const newPhoto: PhotoEvidence = {
      ...photo,
      id,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, photos: [...c.photos, newPhoto], updatedAt: new Date().toISOString() }
          : c
      ),
    }));

    get().addAuditEvent('PHOTO_IMPORTED', { photoId: id, fileName: photo.fileName });
    return id;
  },

  updatePhoto: (photoId, updates) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              photos: c.photos.map((p) => (p.id === photoId ? { ...p, ...updates } : p)),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },

  deletePhoto: (photoId) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, photos: c.photos.filter((p) => p.id !== photoId), updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  },

  confirmPhotoCategory: (photoId, category) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              photos: c.photos.map((p) =>
                p.id === photoId ? { ...p, confirmedCategory: category, confirmed: true } : p
              ),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));

    get().addAuditEvent('PHOTO_CLASSIFIED', { photoId, category });
  },
});
