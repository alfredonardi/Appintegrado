// =============================================================================
// Audit and Progress Slice
// =============================================================================

import { AuditEvent, AuditEventType } from '../../../types/case';
import { v4 as uuidv4 } from 'uuid';
import { CANONICAL_FIELDS } from '../../../types/fieldRegistry';
import { CaseStore } from '../types';
import { StateCreator } from 'zustand';

export interface AuditAndProgressSlice {
  addAuditEvent: (type: AuditEventType, details: Record<string, unknown>) => void;
  calculateRecognitionProgress: () => number;
  calculatePhotoReportProgress: () => number;
  calculateInvestigationProgress: () => number;
  getAlerts: () => Array<{ type: 'warning' | 'error' | 'info'; message: string }>;
}

export const createAuditAndProgressSlice: StateCreator<CaseStore, [], [], AuditAndProgressSlice> = (set, get) => ({
  addAuditEvent: (type, details) => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return;

    const event: AuditEvent = {
      id: uuidv4(),
      type,
      timestamp: new Date().toISOString(),
      user: get().currentUser,
      details,
    };

    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, auditLog: [...c.auditLog, event], updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  },

  calculateRecognitionProgress: () => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return 0;

    // Campos obrigatórios e importantes
    const requiredFields = CANONICAL_FIELDS.filter((f) => f.required || f.usedIn.includes('recognition'));
    const confirmedFields = selectedCase.fieldValues.filter(
      (f) => f.status === 'confirmed' || f.status === 'edited'
    );

    const totalRequired = requiredFields.length;
    const confirmed = confirmedFields.filter((cf) =>
      requiredFields.some((rf) => rf.key === cf.key)
    ).length;

    return totalRequired > 0 ? Math.round((confirmed / totalRequired) * 100) : 0;
  },

  calculatePhotoReportProgress: () => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return 0;

    const { selectedPhotos } = selectedCase.photoReport;
    if (selectedPhotos.length === 0) return 0;

    // Progresso baseado em fotos com legenda
    const withCaption = selectedPhotos.filter((p) => p.caption.length > 10).length;
    return Math.round((withCaption / selectedPhotos.length) * 100);
  },

  calculateInvestigationProgress: () => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return 0;

    const { blocks } = selectedCase.investigationReport;
    const nonEmptyBlocks = blocks.filter((b) => b.content.length > 50).length;
    return Math.round((nonEmptyBlocks / blocks.length) * 100);
  },

  getAlerts: () => {
    const selectedCase = get().selectedCase();
    if (!selectedCase) return [];

    const alerts: Array<{ type: 'warning' | 'error' | 'info'; message: string }> = [];

    // Campos com baixa confiança pendentes
    const lowConfidenceFields = selectedCase.fieldValues.filter(
      (f) => f.status === 'suggested' && f.confidence && f.confidence < 0.8
    );
    if (lowConfidenceFields.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${lowConfidenceFields.length} campo(s) com baixa confiança aguardando confirmação`,
      });
    }

    // Campos obrigatórios vazios
    const requiredFields = CANONICAL_FIELDS.filter((f) => f.required);
    const missingRequired = requiredFields.filter(
      (rf) => !selectedCase.fieldValues.some((fv) => fv.key === rf.key && fv.value.length > 0)
    );
    if (missingRequired.length > 0) {
      alerts.push({
        type: 'error',
        message: `${missingRequired.length} campo(s) obrigatório(s) não preenchido(s)`,
      });
    }

    // Falta de fotos essenciais
    const hasAccessPhoto = selectedCase.photos.some(
      (p) => p.confirmedCategory === 'acesso' || p.suggestedCategory === 'acesso'
    );
    const hasPanoramicPhoto = selectedCase.photos.some(
      (p) => p.confirmedCategory === 'panoramica' || p.suggestedCategory === 'panoramica'
    );
    if (!hasAccessPhoto || !hasPanoramicPhoto) {
      alerts.push({
        type: 'info',
        message: 'Faltam fotos essenciais (acesso principal ou panorâmica)',
      });
    }

    // Fotos não classificadas
    const unconfirmedPhotos = selectedCase.photos.filter((p) => !p.confirmed);
    if (unconfirmedPhotos.length > 0) {
      alerts.push({
        type: 'info',
        message: `${unconfirmedPhotos.length} foto(s) aguardando classificação`,
      });
    }

    return alerts;
  },
});
