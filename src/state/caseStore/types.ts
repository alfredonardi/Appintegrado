// =============================================================================
// CaseStore Types
// =============================================================================

import {
  Case,
  PhotoEvidence,
  FieldValue,
  AIExtraction,
  AuditEvent,
  AuditEventType,
  TeamMember,
  TimelineEvent,
  SelectedPhoto,
  ReportBlock,
  ReportSignatures,
  FieldStatus,
  PhotoCategory,
  CaseStatus,
} from '../../types/case';

export interface CaseStore {
  // Estado
  cases: Case[];
  selectedCaseId: string | null;
  currentUser: string;

  // Seletores derivados
  selectedCase: () => Case | null;

  // Actions - Casos
  createCase: (bo: string, natureza?: string) => string;
  selectCase: (caseId: string | null) => void;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  deleteCase: (caseId: string) => void;
  setCaseStatus: (caseId: string, status: CaseStatus) => void;

  // Actions - Campos
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

  // Actions - Fotos
  addPhoto: (photo: Omit<PhotoEvidence, 'id' | 'createdAt'>) => string;
  updatePhoto: (photoId: string, updates: Partial<PhotoEvidence>) => void;
  deletePhoto: (photoId: string) => void;
  confirmPhotoCategory: (photoId: string, category: PhotoCategory) => void;

  // Actions - Extrações IA
  addAIExtraction: (extraction: Omit<AIExtraction, 'id' | 'createdAt'>) => string;
  confirmAIExtraction: (extractionId: string) => void;
  dismissAIExtraction: (extractionId: string) => void;
  getPendingExtractions: () => AIExtraction[];

  // Actions - Equipe
  setTeam: (team: TeamMember[]) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  removeTeamMember: (memberId: string) => void;

  // Actions - Timeline
  setTimeline: (events: TimelineEvent[]) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (eventId: string, updates: Partial<TimelineEvent>) => void;

  // Actions - Relatório Fotográfico
  setPhotoReportSelection: (photos: SelectedPhoto[]) => void;
  updatePhotoCaption: (photoId: string, caption: string) => void;
  setPhotoReportLayout: (layout: '1-per-page' | '2-per-page') => void;
  setPhotoReportOptions: (options: { includeCover?: boolean; includeHeaderFooter?: boolean }) => void;

  // Actions - Relatório de Investigação
  updateReportBlock: (blockId: string, content: string, referencedFieldKeys?: string[], referencedPhotoIds?: string[]) => void;
  setBlockAIGenerated: (blockId: string, content: string) => void;
  confirmBlockContent: (blockId: string) => void;
  setReportSignatures: (signatures: Partial<ReportSignatures>) => void;

  // Actions - Auditoria
  addAuditEvent: (type: AuditEventType, details: Record<string, unknown>) => void;

  // Actions - Cálculos de Progresso
  calculateRecognitionProgress: () => number;
  calculatePhotoReportProgress: () => number;
  calculateInvestigationProgress: () => number;
  getAlerts: () => Array<{ type: 'warning' | 'error' | 'info'; message: string }>;

  // Actions - PDF/Export
  addGeneratedPDF: (pdf: { type: 'recognition' | 'photo-report' | 'investigation'; fileName: string; base64?: string }) => void;
}
