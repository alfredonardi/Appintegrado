// =============================================================================
// Timeline Slice
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { TimelineEvent } from '../../../types/case';
import { CaseStore } from '../types';
import { StateCreator } from 'zustand';

export interface TimelineSlice {
  setTimeline: (events: TimelineEvent[]) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (eventId: string, updates: Partial<TimelineEvent>) => void;
}

export const createTimelineSlice: StateCreator<CaseStore, [], [], TimelineSlice> = (set, get) => ({
  setTimeline: (events) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id ? { ...c, events, updatedAt: new Date().toISOString() } : c
      ),
    }));
  },

  addTimelineEvent: (event) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    const newEvent: TimelineEvent = { ...event, id: uuidv4() };

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, events: [...c.events, newEvent], updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  },

  updateTimelineEvent: (eventId, updates) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              events: c.events.map((e) => (e.id === eventId ? { ...e, ...updates } : e)),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },
});
