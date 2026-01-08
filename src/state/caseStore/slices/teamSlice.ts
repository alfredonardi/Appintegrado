// =============================================================================
// Team Slice
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { TeamMember } from '../../../types/case';
import { CaseStore } from '../types';
import { StateCreator } from 'zustand';

export interface TeamSlice {
  setTeam: (team: TeamMember[]) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  removeTeamMember: (memberId: string) => void;
}

export const createTeamSlice: StateCreator<CaseStore, [], [], TeamSlice> = (set, get) => ({
  setTeam: (team) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id ? { ...c, team, updatedAt: new Date().toISOString() } : c
      ),
    }));
  },

  addTeamMember: (member) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    const newMember: TeamMember = { ...member, id: uuidv4() };

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, team: [...c.team, newMember], updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  },

  removeTeamMember: (memberId) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, team: c.team.filter((m) => m.id !== memberId), updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  },
});
