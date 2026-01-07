// =============================================================================
// CaseHub - Store Global (Zustand)
// =============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  Case,
  createEmptyCase,
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
} from '../types/case';
import { CANONICAL_FIELDS, getFieldByKey } from '../types/fieldRegistry';

// =============================================================================
// Interface do Store
// =============================================================================
interface CaseStore {
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

// =============================================================================
// Dados de demonstração
// =============================================================================
const createDemoCase = (): Case => {
  const caseData = createEmptyCase(uuidv4(), '2025/123456');

  caseData.natureza = 'Homicídio';
  caseData.dataHoraFato = '2025-01-15T03:30:00.000Z';
  caseData.endereco = 'Rua das Palmeiras, 123, Centro';
  caseData.cep = '01234-567';
  caseData.bairro = 'Centro';
  caseData.cidade = 'São Paulo';
  caseData.estado = 'SP';
  caseData.circunscricao = '1ª Circunscrição';
  caseData.unidade = 'DHPP';
  caseData.status = 'em_revisao';

  caseData.team = [
    { id: '1', role: 'Delegado', name: 'Dr. Silva', badge: '12345' },
    { id: '2', role: 'Escrivão', name: 'Maria Santos', badge: '12346' },
    { id: '3', role: 'Investigador', name: 'João Costa', badge: '12347' },
    { id: '4', role: 'Fotógrafo', name: 'Pedro Lima', badge: '12348' },
  ];

  caseData.events = [
    { id: '1', type: 'acionamento', label: 'Acionamento', timestamp: '2025-01-15T04:15:00.000Z', description: 'Acionamento via COPOM' },
    { id: '2', type: 'chegada', label: 'Chegada ao Local', timestamp: '2025-01-15T04:45:00.000Z' },
    { id: '3', type: 'liberacao', label: 'Liberação do Local', timestamp: '2025-01-15T08:30:00.000Z' },
    { id: '4', type: 'termino', label: 'Término dos Trabalhos', timestamp: '2025-01-15T09:00:00.000Z' },
  ];

  // Campos canônicos iniciais (confirmados manualmente para demo)
  caseData.fieldValues = [
    { key: 'case.bo', value: '2025/123456', status: 'confirmed', sources: ['Manual'], lastUpdated: new Date().toISOString(), updatedBy: 'Sistema' },
    { key: 'case.natureza', value: 'Homicídio', status: 'confirmed', sources: ['Manual'], lastUpdated: new Date().toISOString(), updatedBy: 'Sistema' },
    { key: 'case.dataHoraFato', value: '2025-01-15T03:30:00.000Z', status: 'confirmed', sources: ['Manual'], lastUpdated: new Date().toISOString(), updatedBy: 'Sistema' },
    { key: 'location.endereco', value: 'Rua das Palmeiras, 123, Centro', status: 'confirmed', sources: ['Manual'], lastUpdated: new Date().toISOString(), updatedBy: 'Sistema' },
    { key: 'location.cep', value: '01234-567', status: 'confirmed', sources: ['Manual'], lastUpdated: new Date().toISOString(), updatedBy: 'Sistema' },
    { key: 'environment.iluminacao', value: 'Artificial (noite)', status: 'suggested', confidence: 0.87, sources: ['Foto 1', 'Foto 3'], lastUpdated: new Date().toISOString(), updatedBy: 'IA' },
    { key: 'environment.tipoVia', value: 'Via pública (asfalto)', status: 'suggested', confidence: 0.92, sources: ['Foto 2'], lastUpdated: new Date().toISOString(), updatedBy: 'IA' },
    { key: 'environment.clima', value: 'Céu limpo', status: 'suggested', confidence: 0.78, sources: ['Foto 1'], lastUpdated: new Date().toISOString(), updatedBy: 'IA' },
    { key: 'security.cameras', value: 'Sim', status: 'suggested', confidence: 0.95, sources: ['Foto 4', 'Foto 5'], lastUpdated: new Date().toISOString(), updatedBy: 'IA' },
  ];

  // Extrações de IA pendentes para demo
  caseData.aiExtractions = [
    {
      id: '1',
      fieldKey: 'environment.iluminacao',
      suggestedValue: 'Artificial (noite)',
      confidence: 0.87,
      sourceEvidenceIds: ['photo1', 'photo3'],
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      fieldKey: 'environment.tipoVia',
      suggestedValue: 'Via pública (asfalto)',
      confidence: 0.92,
      sourceEvidenceIds: ['photo2'],
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ];

  // Fotos de demonstração
  caseData.photos = [
    {
      id: 'photo1',
      fileName: 'IMG_001.jpg',
      fileData: '', // vazio para demo
      mimeType: 'image/jpeg',
      suggestedCategory: 'panoramica',
      confirmedCategory: 'panoramica',
      confidence: 0.94,
      tags: ['entrada', 'fachada'],
      createdAt: new Date().toISOString(),
      confirmed: true,
    },
    {
      id: 'photo2',
      fileName: 'IMG_002.jpg',
      fileData: '',
      mimeType: 'image/jpeg',
      suggestedCategory: 'vestigios',
      confidence: 0.87,
      tags: ['sangue', 'piso'],
      createdAt: new Date().toISOString(),
      confirmed: false,
    },
    {
      id: 'photo3',
      fileName: 'IMG_003.jpg',
      fileData: '',
      mimeType: 'image/jpeg',
      suggestedCategory: 'acesso',
      confirmedCategory: 'acesso',
      confidence: 0.91,
      tags: ['porta', 'entrada'],
      createdAt: new Date().toISOString(),
      confirmed: true,
    },
    {
      id: 'photo4',
      fileName: 'IMG_004.jpg',
      fileData: '',
      mimeType: 'image/jpeg',
      suggestedCategory: 'numeracao',
      confidence: 0.96,
      tags: ['marcador', 'evidencia'],
      createdAt: new Date().toISOString(),
      confirmed: false,
    },
  ];

  // Fotos selecionadas para relatório
  caseData.photoReport.selectedPhotos = [
    { photoId: 'photo1', order: 0, caption: 'Vista panorâmica da entrada principal do imóvel' },
    { photoId: 'photo3', order: 1, caption: 'Acesso principal com porta em bom estado de conservação' },
  ];

  // Alguns blocos do relatório de investigação com conteúdo
  caseData.investigationReport.blocks[0].content = 'O presente relatório trata-se de homicídio ocorrido na Rua das Palmeiras, 123, Centro, em 15/01/2025 às 03:30h.';
  caseData.investigationReport.blocks[0].status = 'draft';
  caseData.investigationReport.blocks[0].referencedFieldKeys = ['case.bo', 'case.natureza', 'case.dataHoraFato', 'location.endereco'];

  // Auditoria inicial
  caseData.auditLog = [
    {
      id: uuidv4(),
      type: 'CASE_CREATED',
      timestamp: new Date().toISOString(),
      user: 'Sistema',
      details: { bo: '2025/123456' },
    },
  ];

  return caseData;
};

const createDemoCase2 = (): Case => {
  const caseData = createEmptyCase(uuidv4(), '2025/123445');
  caseData.natureza = 'Roubo';
  caseData.dataHoraFato = '2025-01-14T22:15:00.000Z';
  caseData.endereco = 'Av. Brasil, 500, Jardim América';
  caseData.status = 'rascunho';
  return caseData;
};

const createDemoCase3 = (): Case => {
  const caseData = createEmptyCase(uuidv4(), '2025/123434');
  caseData.natureza = 'Latrocínio';
  caseData.dataHoraFato = '2025-01-10T14:00:00.000Z';
  caseData.endereco = 'Rua Augusta, 1000, Consolação';
  caseData.status = 'finalizado';
  return caseData;
};

// =============================================================================
// Store Zustand
// =============================================================================
export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      cases: [createDemoCase(), createDemoCase2(), createDemoCase3()],
      selectedCaseId: null,
      currentUser: 'Dr. Silva',

      // Seletor derivado
      selectedCase: () => {
        const { cases, selectedCaseId } = get();
        return cases.find((c) => c.id === selectedCaseId) || null;
      },

      // =========================================================================
      // Actions - Casos
      // =========================================================================
      createCase: (bo: string, natureza?: string) => {
        const id = uuidv4();
        const newCase = createEmptyCase(id, bo);
        if (natureza) newCase.natureza = natureza;

        // Adiciona campos canônicos iniciais
        newCase.fieldValues = [
          { key: 'case.bo', value: bo, status: 'confirmed', sources: ['Manual'], lastUpdated: new Date().toISOString(), updatedBy: get().currentUser },
        ];
        if (natureza) {
          newCase.fieldValues.push({ key: 'case.natureza', value: natureza, status: 'confirmed', sources: ['Manual'], lastUpdated: new Date().toISOString(), updatedBy: get().currentUser });
        }

        newCase.auditLog.push({
          id: uuidv4(),
          type: 'CASE_CREATED',
          timestamp: new Date().toISOString(),
          user: get().currentUser,
          details: { bo, natureza },
        });

        set((state) => ({ cases: [...state.cases, newCase] }));
        return id;
      },

      selectCase: (caseId: string | null) => {
        set({ selectedCaseId: caseId });
      },

      updateCase: (caseId: string, updates: Partial<Case>) => {
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteCase: (caseId: string) => {
        set((state) => ({
          cases: state.cases.filter((c) => c.id !== caseId),
          selectedCaseId: state.selectedCaseId === caseId ? null : state.selectedCaseId,
        }));
      },

      setCaseStatus: (caseId: string, status: CaseStatus) => {
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId ? { ...c, status, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      // =========================================================================
      // Actions - Campos Canônicos
      // =========================================================================
      setFieldValue: (key, value, status, sources = ['Manual'], confidence) => {
        const selectedCase = get().selectedCase();
        if (!selectedCase) return;

        const newFieldValue: FieldValue = {
          key,
          value,
          status,
          confidence,
          sources,
          lastUpdated: new Date().toISOString(),
          updatedBy: status === 'suggested' ? 'IA' : get().currentUser,
        };

        const existingIndex = selectedCase.fieldValues.findIndex((f) => f.key === key);
        let newFieldValues: FieldValue[];

        if (existingIndex >= 0) {
          newFieldValues = [...selectedCase.fieldValues];
          newFieldValues[existingIndex] = newFieldValue;
        } else {
          newFieldValues = [...selectedCase.fieldValues, newFieldValue];
        }

        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === selectedCase.id
              ? { ...c, fieldValues: newFieldValues, updatedAt: new Date().toISOString() }
              : c
          ),
        }));

        // Adiciona evento de auditoria
        get().addAuditEvent(
          status === 'suggested' ? 'AI_SUGGESTED' : status === 'confirmed' ? 'FIELD_CONFIRMED' : 'FIELD_EDITED',
          { key, value, status, confidence }
        );
      },

      confirmField: (key: string) => {
        const selectedCase = get().selectedCase();
        if (!selectedCase) return;

        const field = selectedCase.fieldValues.find((f) => f.key === key);
        if (!field) return;

        get().setFieldValue(key, field.value, 'confirmed', field.sources, field.confidence);
      },

      editField: (key: string, newValue: string) => {
        const selectedCase = get().selectedCase();
        if (!selectedCase) return;

        const field = selectedCase.fieldValues.find((f) => f.key === key);
        const sources = field ? [...field.sources, 'Editado manualmente'] : ['Manual'];

        get().setFieldValue(key, newValue, 'edited', sources);
      },

      getFieldValue: (key: string) => {
        const selectedCase = get().selectedCase();
        if (!selectedCase) return undefined;
        return selectedCase.fieldValues.find((f) => f.key === key);
      },

      getConfirmedFields: () => {
        const selectedCase = get().selectedCase();
        if (!selectedCase) return [];
        return selectedCase.fieldValues.filter((f) => f.status === 'confirmed' || f.status === 'edited');
      },

      // =========================================================================
      // Actions - Fotos
      // =========================================================================
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

      // =========================================================================
      // Actions - Extrações IA
      // =========================================================================
      addAIExtraction: (extraction) => {
        const selectedCase = get().selectedCase();
        if (!selectedCase) return '';

        const id = uuidv4();
        const newExtraction: AIExtraction = {
          ...extraction,
          id,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === selectedCase.id
              ? { ...c, aiExtractions: [...c.aiExtractions, newExtraction], updatedAt: new Date().toISOString() }
              : c
          ),
        }));

        // Adiciona também como FieldValue sugerido
        get().setFieldValue(
          extraction.fieldKey,
          extraction.suggestedValue,
          'suggested',
          extraction.sourceEvidenceIds.map((id) => `Foto ${id}`),
          extraction.confidence
        );

        return id;
      },

      confirmAIExtraction: (extractionId) => {
        const selectedCase = get().selectedCase();
        if (!selectedCase) return;

        const extraction = selectedCase.aiExtractions.find((e) => e.id === extractionId);
        if (!extraction) return;

        // Atualiza status da extração
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === selectedCase.id
              ? {
                  ...c,
                  aiExtractions: c.aiExtractions.map((e) =>
                    e.id === extractionId ? { ...e, status: 'confirmed' as const } : e
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        }));

        // Confirma o campo
        get().confirmField(extraction.fieldKey);
      },

      dismissAIExtraction: (extractionId) => {
        const selectedCase = get().selectedCase();
        if (!selectedCase) return;

        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === selectedCase.id
              ? {
                  ...c,
                  aiExtractions: c.aiExtractions.map((e) =>
                    e.id === extractionId ? { ...e, status: 'dismissed' as const } : e
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        }));

        get().addAuditEvent('FIELD_DISMISSED', { extractionId });
      },

      getPendingExtractions: () => {
        const selectedCase = get().selectedCase();
        if (!selectedCase) return [];
        return selectedCase.aiExtractions.filter((e) => e.status === 'pending');
      },

      // =========================================================================
      // Actions - Equipe
      // =========================================================================
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

      // =========================================================================
      // Actions - Timeline
      // =========================================================================
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

      // =========================================================================
      // Actions - Relatório Fotográfico
      // =========================================================================
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

      // =========================================================================
      // Actions - Relatório de Investigação
      // =========================================================================
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

      // =========================================================================
      // Actions - Auditoria
      // =========================================================================
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

      // =========================================================================
      // Actions - Cálculos de Progresso
      // =========================================================================
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

      // =========================================================================
      // Actions - PDF/Export
      // =========================================================================
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
    }),
    {
      name: 'casehub-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cases: state.cases.map((c) => ({
          ...c,
          // Remove blobs grandes para storage
          photos: c.photos.map((p) => ({ ...p, fileData: p.fileData.length > 1000 ? '' : p.fileData })),
          generatedPDFs: c.generatedPDFs.map((pdf) => ({ ...pdf, base64: undefined })),
        })),
        selectedCaseId: state.selectedCaseId,
        currentUser: state.currentUser,
      }),
    }
  )
);

// =============================================================================
// Hooks auxiliares
// =============================================================================
export const useSelectedCase = () => {
  const selectedCase = useCaseStore((state) => state.selectedCase());
  return selectedCase;
};

export const useFieldValue = (key: string) => {
  const selectedCase = useCaseStore((state) => state.selectedCase());
  return selectedCase?.fieldValues.find((f) => f.key === key);
};

export const useCaseProgress = () => {
  const store = useCaseStore();
  return {
    recognition: store.calculateRecognitionProgress(),
    photoReport: store.calculatePhotoReportProgress(),
    investigation: store.calculateInvestigationProgress(),
  };
};
