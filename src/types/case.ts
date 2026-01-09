// =============================================================================
// CaseHub - Modelo de Dados Único
// =============================================================================

// Status de campos
export type FieldStatus = 'suggested' | 'confirmed' | 'edited';

// Status de extração IA
export type AIExtractionStatus = 'pending' | 'confirmed' | 'dismissed';

// Tipos de eventos de auditoria
export type AuditEventType =
  | 'CASE_CREATED'
  | 'CASE_UPDATED'
  | 'PHOTO_IMPORTED'
  | 'PHOTO_CLASSIFIED'
  | 'AI_SUGGESTED'
  | 'FIELD_CONFIRMED'
  | 'FIELD_EDITED'
  | 'FIELD_DISMISSED'
  | 'BLOCK_CREATED'
  | 'BLOCK_UPDATED'
  | 'BLOCK_AI_GENERATED'
  | 'PDF_GENERATED'
  | 'EXPORT_CREATED';

// Status do caso
export type CaseStatus = 'rascunho' | 'em_revisao' | 'finalizado';

// Categorias de fotos
export type PhotoCategory =
  | 'panoramica'
  | 'vestigios'
  | 'acesso'
  | 'numeracao'
  | 'detalhes'
  | 'vitima'
  | 'arma'
  | 'outros';

// =============================================================================
// Valor de Campo Canônico - Núcleo do sistema
// =============================================================================
export interface FieldValue {
  key: string; // ex: case.bo, location.endereco, environment.iluminacao
  value: string;
  status: FieldStatus;
  confidence?: number; // 0-1, opcional para campos manuais
  sources: string[]; // ex: ['Foto 1', 'Foto 3', 'Manual']
  lastUpdated: string; // ISO date
  updatedBy: string;
}

// =============================================================================
// Evidência Fotográfica
// =============================================================================
export interface PhotoEvidence {
  id: string;
  fileName: string;
  fileData: string; // base64
  mimeType: string;
  suggestedCategory?: PhotoCategory;
  confirmedCategory?: PhotoCategory;
  confidence?: number; // 0-1
  tags: string[];
  createdAt: string; // ISO date
  confirmed: boolean;
  width?: number;
  height?: number;
  metadata?: Record<string, unknown>; // EXIF, etc.
}

// =============================================================================
// Extração de IA
// =============================================================================
export interface AIExtraction {
  id: string;
  fieldKey: string; // chave canônica
  suggestedValue: string;
  confidence: number; // 0-1
  sourceEvidenceIds: string[]; // IDs das fotos fonte
  sourceText?: string; // texto fonte opcional
  status: AIExtractionStatus;
  createdAt: string; // ISO date
}

// =============================================================================
// Evento de Auditoria (Rastreabilidade)
// =============================================================================
export interface AuditEvent {
  id: string;
  type: AuditEventType;
  timestamp: string; // ISO date
  user: string;
  details: Record<string, unknown>;
}

// =============================================================================
// Membro da Equipe
// =============================================================================
export interface TeamMember {
  id: string;
  role: string; // ex: Delegado, Escrivão, Investigador, Fotógrafo
  name: string;
  badge?: string; // matrícula
}

// =============================================================================
// Evento da Timeline
// =============================================================================
export interface TimelineEvent {
  id: string;
  type: string; // ex: acionamento, chegada, liberacao, termino
  label: string;
  timestamp: string; // ISO date
  description?: string;
}

// =============================================================================
// Bloco do Relatório de Investigação
// =============================================================================
export interface ReportBlock {
  id: string;
  title: string;
  content: string;
  status: 'empty' | 'draft' | 'ai_generated' | 'confirmed';
  referencedFieldKeys: string[]; // campos canônicos usados
  referencedPhotoIds: string[]; // fotos referenciadas
  aiGenerated: boolean;
  lastUpdated: string;
}

// =============================================================================
// Assinaturas do Relatório
// =============================================================================
export interface ReportSignatures {
  responsible1Name: string;
  responsible1Role: string;
  responsible2Name: string;
  responsible2Role: string;
  location: string;
  date: string;
}

// =============================================================================
// Foto Selecionada para Relatório Fotográfico
// =============================================================================
export interface SelectedPhoto {
  photoId: string;
  order: number;
  caption: string;
}

// =============================================================================
// Reconhecimento Visuográfico
// =============================================================================
export interface Recognition {
  // Campos estruturados organizados por seção
  sections: {
    preliminary: string[]; // keys dos campos
    communications: string[];
    team: string[];
    weather: string[];
    location: string[];
    evidence: string[];
  };
  completedSections: string[];
  lastUpdated: string;
}

// =============================================================================
// Relatório Fotográfico
// =============================================================================
export interface PhotoReport {
  selectedPhotos: SelectedPhoto[];
  layout: '1-per-page' | '2-per-page';
  includeCover: boolean;
  includeHeaderFooter: boolean;
  lastUpdated: string;
}

// =============================================================================
// Relatório de Investigação
// =============================================================================
export interface InvestigationReport {
  blocks: ReportBlock[];
  signatures: ReportSignatures;
  lastUpdated: string;
}

// =============================================================================
// PDFs Gerados
// =============================================================================
export interface GeneratedPDF {
  type: 'recognition' | 'photo-report' | 'investigation';
  fileName: string;
  blob?: Blob;
  base64?: string;
  generatedAt: string;
  generatedBy: string;
}

// =============================================================================
// Caso - Entidade Principal
// =============================================================================
export interface Case {
  id: string;

  // Dados básicos
  bo: string;
  natureza: string;
  dataHoraFato: string; // ISO date

  // Localização
  endereco: string;
  cep: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

  // Jurisdição
  circunscricao: string;
  unidade: string;

  // Status
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;

  // Organizações e times (Nhost)
  organization_id?: string;
  team_id?: string;
  shared_with_org?: boolean; // Se verdadeiro, visível para chefes/delegados da org

  // Equipe
  team: TeamMember[];

  // Timeline de eventos
  events: TimelineEvent[];

  // Evidências fotográficas
  photos: PhotoEvidence[];

  // Campos canônicos - núcleo do sistema
  fieldValues: FieldValue[];

  // Extrações de IA pendentes/processadas
  aiExtractions: AIExtraction[];

  // Documentos
  recognition: Recognition;
  photoReport: PhotoReport;
  investigationReport: InvestigationReport;

  // PDFs gerados
  generatedPDFs: GeneratedPDF[];

  // Auditoria
  auditLog: AuditEvent[];
}

// =============================================================================
// Estado inicial de um novo caso
// =============================================================================
export const createEmptyCase = (id: string, bo: string): Case => ({
  id,
  bo,
  natureza: '',
  dataHoraFato: new Date().toISOString(),
  endereco: '',
  cep: '',
  bairro: '',
  cidade: '',
  estado: '',
  circunscricao: '',
  unidade: '',
  status: 'rascunho',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  team: [],
  events: [],
  photos: [],
  fieldValues: [],
  aiExtractions: [],
  recognition: {
    sections: {
      preliminary: [],
      communications: [],
      team: [],
      weather: [],
      location: [],
      evidence: [],
    },
    completedSections: [],
    lastUpdated: new Date().toISOString(),
  },
  photoReport: {
    selectedPhotos: [],
    layout: '1-per-page',
    includeCover: true,
    includeHeaderFooter: true,
    lastUpdated: new Date().toISOString(),
  },
  investigationReport: {
    blocks: [
      {
        id: 'summary',
        title: 'Resumo Executivo',
        content: '',
        status: 'empty',
        referencedFieldKeys: [],
        referencedPhotoIds: [],
        aiGenerated: false,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'dynamics',
        title: 'Dinâmica dos Fatos',
        content: '',
        status: 'empty',
        referencedFieldKeys: [],
        referencedPhotoIds: [],
        aiGenerated: false,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'victims',
        title: 'Vítimas e Envolvidos',
        content: '',
        status: 'empty',
        referencedFieldKeys: [],
        referencedPhotoIds: [],
        aiGenerated: false,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'police',
        title: 'Ação Policial',
        content: '',
        status: 'empty',
        referencedFieldKeys: [],
        referencedPhotoIds: [],
        aiGenerated: false,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'procedures',
        title: 'Procedimentos Realizados',
        content: '',
        status: 'empty',
        referencedFieldKeys: [],
        referencedPhotoIds: [],
        aiGenerated: false,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'cameras',
        title: 'Câmeras e Vigilância',
        content: '',
        status: 'empty',
        referencedFieldKeys: [],
        referencedPhotoIds: [],
        aiGenerated: false,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'conclusion',
        title: 'Conclusão',
        content: '',
        status: 'empty',
        referencedFieldKeys: [],
        referencedPhotoIds: [],
        aiGenerated: false,
        lastUpdated: new Date().toISOString(),
      },
    ],
    signatures: {
      responsible1Name: '',
      responsible1Role: '',
      responsible2Name: '',
      responsible2Role: '',
      location: '',
      date: '',
    },
    lastUpdated: new Date().toISOString(),
  },
  generatedPDFs: [],
  auditLog: [],
});
