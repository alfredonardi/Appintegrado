// =============================================================================
// CaseHub - Seletores e Helpers para Casos
// =============================================================================

import { Case, PhotoEvidence, FieldValue, PhotoCategory, ReportBlock, GeneratedPDF } from '../types/case';

// =============================================================================
// Seletores de Campos
// =============================================================================

/**
 * Retorna o valor de um campo canônico específico
 */
export const getFieldValue = (caseData: Case, key: string): FieldValue | undefined => {
  return caseData.fieldValues.find((f) => f.key === key);
};

/**
 * Retorna todos os campos confirmados ou editados
 */
export const getConfirmedFields = (caseData: Case): FieldValue[] => {
  return caseData.fieldValues.filter((f) => f.status === 'confirmed' || f.status === 'edited');
};

/**
 * Retorna todos os campos sugeridos pela IA
 */
export const getSuggestedFields = (caseData: Case): FieldValue[] => {
  return caseData.fieldValues.filter((f) => f.status === 'suggested');
};

/**
 * Retorna campos com baixa confiança (< threshold)
 */
export const getLowConfidenceFields = (caseData: Case, threshold = 0.8): FieldValue[] => {
  return caseData.fieldValues.filter(
    (f) => f.status === 'suggested' && f.confidence !== undefined && f.confidence < threshold
  );
};

// =============================================================================
// Seletores de Fotos
// =============================================================================

/**
 * Retorna fotos por categoria
 */
export const getPhotosByCategory = (caseData: Case, category: PhotoCategory): PhotoEvidence[] => {
  return caseData.photos.filter(
    (p) => p.confirmedCategory === category || p.suggestedCategory === category
  );
};

/**
 * Retorna fotos confirmadas
 */
export const getConfirmedPhotos = (caseData: Case): PhotoEvidence[] => {
  return caseData.photos.filter((p) => p.confirmed);
};

/**
 * Retorna fotos não confirmadas
 */
export const getPendingPhotos = (caseData: Case): PhotoEvidence[] => {
  return caseData.photos.filter((p) => !p.confirmed);
};

/**
 * Retorna uma foto pelo ID
 */
export const getPhotoById = (caseData: Case, photoId: string): PhotoEvidence | undefined => {
  return caseData.photos.find((p) => p.id === photoId);
};

// =============================================================================
// Seletores de Relatórios
// =============================================================================

/**
 * Retorna relatório gerado por tipo
 */
export const getReportByType = (
  caseData: Case,
  type: 'recognition' | 'photo-report' | 'investigation'
): GeneratedPDF | undefined => {
  return caseData.generatedPDFs.find((pdf) => pdf.type === type);
};

/**
 * Retorna bloco do relatório de investigação por ID
 */
export const getReportBlock = (caseData: Case, blockId: string): ReportBlock | undefined => {
  return caseData.investigationReport.blocks.find((b) => b.id === blockId);
};

/**
 * Retorna blocos preenchidos do relatório de investigação
 */
export const getFilledReportBlocks = (caseData: Case): ReportBlock[] => {
  return caseData.investigationReport.blocks.filter((b) => b.content.length > 50);
};

// =============================================================================
// Estatísticas
// =============================================================================

/**
 * Retorna estatísticas gerais do caso
 */
export const getCaseStats = (caseData: Case) => {
  const totalPhotos = caseData.photos.length;
  const confirmedPhotos = caseData.photos.filter((p) => p.confirmed).length;
  const totalFields = caseData.fieldValues.length;
  const confirmedFields = caseData.fieldValues.filter(
    (f) => f.status === 'confirmed' || f.status === 'edited'
  ).length;
  const suggestedFields = caseData.fieldValues.filter((f) => f.status === 'suggested').length;
  const pendingExtractions = caseData.aiExtractions.filter((e) => e.status === 'pending').length;
  const filledBlocks = caseData.investigationReport.blocks.filter((b) => b.content.length > 50).length;
  const totalBlocks = caseData.investigationReport.blocks.length;

  return {
    totalPhotos,
    confirmedPhotos,
    pendingPhotos: totalPhotos - confirmedPhotos,
    totalFields,
    confirmedFields,
    suggestedFields,
    pendingExtractions,
    filledBlocks,
    totalBlocks,
    teamSize: caseData.team.length,
    eventsCount: caseData.events.length,
    auditEventsCount: caseData.auditLog.length,
  };
};

/**
 * Calcula progresso geral do caso (0-100)
 */
export const calculateOverallProgress = (caseData: Case): number => {
  const stats = getCaseStats(caseData);

  // Pesos para cada componente
  const weights = {
    photos: 20, // 20% do progresso
    fields: 30, // 30% do progresso
    blocks: 50, // 50% do progresso (relatório principal)
  };

  let progress = 0;

  // Progresso de fotos
  if (stats.totalPhotos > 0) {
    progress += (stats.confirmedPhotos / stats.totalPhotos) * weights.photos;
  }

  // Progresso de campos
  if (stats.totalFields > 0) {
    progress += (stats.confirmedFields / stats.totalFields) * weights.fields;
  }

  // Progresso de blocos
  if (stats.totalBlocks > 0) {
    progress += (stats.filledBlocks / stats.totalBlocks) * weights.blocks;
  }

  return Math.round(progress);
};

// =============================================================================
// Validação
// =============================================================================

/**
 * Verifica se o caso está pronto para exportação
 */
export const isCaseReadyForExport = (caseData: Case): { ready: boolean; missing: string[] } => {
  const missing: string[] = [];

  // Verificar campos obrigatórios
  const requiredFieldKeys = ['case.bo', 'case.natureza', 'case.dataHoraFato', 'location.endereco'];
  for (const key of requiredFieldKeys) {
    const field = getFieldValue(caseData, key);
    if (!field || field.value.length === 0) {
      missing.push(`Campo ${key} não preenchido`);
    }
  }

  // Verificar fotos
  if (caseData.photos.length === 0) {
    missing.push('Nenhuma foto importada');
  }

  // Verificar fotos confirmadas
  const confirmedPhotos = getConfirmedPhotos(caseData);
  if (confirmedPhotos.length === 0 && caseData.photos.length > 0) {
    missing.push('Nenhuma foto classificada');
  }

  // Verificar relatório fotográfico
  if (caseData.photoReport.selectedPhotos.length === 0) {
    missing.push('Relatório fotográfico sem fotos selecionadas');
  }

  return {
    ready: missing.length === 0,
    missing,
  };
};

/**
 * Retorna categoria de foto como label legível
 */
export const getCategoryLabel = (category: PhotoCategory | undefined): string => {
  if (!category) return 'Sem categoria';

  const labels: Record<PhotoCategory, string> = {
    panoramica: 'Panorâmica',
    vestigios: 'Vestígios',
    acesso: 'Acesso',
    numeracao: 'Numeração',
    detalhes: 'Detalhes',
    vitima: 'Vítima',
    arma: 'Arma',
    outros: 'Outros',
  };

  return labels[category] || 'Sem categoria';
};
