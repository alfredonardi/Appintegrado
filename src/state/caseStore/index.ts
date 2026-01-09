// =============================================================================
// CaseStore - Final assembly with all slices
// =============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Case, createEmptyCase } from '../../types/case';
import { CaseStore } from './types';

// Import all slices
import { createCasesSlice } from './slices/casesSlice';
import { createFieldsSlice } from './slices/fieldsSlice';
import { createPhotosSlice } from './slices/photosSlice';
import { createAISlice } from './slices/aiSlice';
import { createTeamSlice } from './slices/teamSlice';
import { createTimelineSlice } from './slices/timelineSlice';
import { createPhotoReportSlice } from './slices/photoReportSlice';
import { createInvestigationReportSlice } from './slices/investigationReportSlice';
import { createAuditAndProgressSlice } from './slices/auditAndProgressSlice';
import { createPDFSlice } from './slices/pdfSlice';

// =============================================================================
// Demo Data
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
// Store Creation
// =============================================================================

export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      cases: [createDemoCase(), createDemoCase2(), createDemoCase3()],
      selectedCaseId: null,
      currentUser: 'Dr. Silva',

      // Combine all slices
      ...createCasesSlice(set, get),
      ...createFieldsSlice(set, get),
      ...createPhotosSlice(set, get),
      ...createAISlice(set, get),
      ...createTeamSlice(set, get),
      ...createTimelineSlice(set, get),
      ...createPhotoReportSlice(set, get),
      ...createInvestigationReportSlice(set, get),
      ...createAuditAndProgressSlice(set, get),
      ...createPDFSlice(set, get),
    }),
    {
      name: 'atlas-storage',
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
// Helper Hooks
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
