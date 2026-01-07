// =============================================================================
// Export Service - Geração de pacotes ZIP
// =============================================================================

import JSZip from 'jszip';
import { Case } from '../types/case';
import {
  generateRecognitionHTML,
  generatePhotoReportHTML,
  generateInvestigationReportHTML,
} from './pdfService';

// =============================================================================
// Gerar JSON do caso com metadados completos
// =============================================================================
export const generateCaseJSON = (caseData: Case): object => {
  return {
    metadata: {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      application: 'CaseHub',
    },
    case: {
      id: caseData.id,
      bo: caseData.bo,
      natureza: caseData.natureza,
      dataHoraFato: caseData.dataHoraFato,
      endereco: caseData.endereco,
      cep: caseData.cep,
      bairro: caseData.bairro,
      cidade: caseData.cidade,
      estado: caseData.estado,
      circunscricao: caseData.circunscricao,
      unidade: caseData.unidade,
      status: caseData.status,
      createdAt: caseData.createdAt,
      updatedAt: caseData.updatedAt,
    },
    team: caseData.team,
    events: caseData.events,
    fieldValues: caseData.fieldValues.map((fv) => ({
      key: fv.key,
      value: fv.value,
      status: fv.status,
      confidence: fv.confidence,
      sources: fv.sources,
      lastUpdated: fv.lastUpdated,
      updatedBy: fv.updatedBy,
    })),
    photos: caseData.photos.map((p) => ({
      id: p.id,
      fileName: p.fileName,
      mimeType: p.mimeType,
      category: p.confirmedCategory || p.suggestedCategory,
      confirmed: p.confirmed,
      confidence: p.confidence,
      tags: p.tags,
      createdAt: p.createdAt,
    })),
    recognition: {
      completedSections: caseData.recognition.completedSections,
      lastUpdated: caseData.recognition.lastUpdated,
    },
    photoReport: {
      selectedPhotosCount: caseData.photoReport.selectedPhotos.length,
      layout: caseData.photoReport.layout,
      lastUpdated: caseData.photoReport.lastUpdated,
    },
    investigationReport: {
      blocks: caseData.investigationReport.blocks.map((b) => ({
        id: b.id,
        title: b.title,
        status: b.status,
        aiGenerated: b.aiGenerated,
        contentLength: b.content.length,
        referencedFieldKeys: b.referencedFieldKeys,
        referencedPhotoIds: b.referencedPhotoIds,
        lastUpdated: b.lastUpdated,
      })),
      signatures: caseData.investigationReport.signatures,
      lastUpdated: caseData.investigationReport.lastUpdated,
    },
    auditLog: caseData.auditLog,
    statistics: {
      totalPhotos: caseData.photos.length,
      confirmedPhotos: caseData.photos.filter((p) => p.confirmed).length,
      totalFields: caseData.fieldValues.length,
      confirmedFields: caseData.fieldValues.filter(
        (f) => f.status === 'confirmed' || f.status === 'edited'
      ).length,
      suggestedFields: caseData.fieldValues.filter((f) => f.status === 'suggested').length,
      totalAuditEvents: caseData.auditLog.length,
    },
  };
};

// =============================================================================
// Converter base64 para Blob
// =============================================================================
const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(',');
  const contentType = parts[0]?.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const raw = atob(parts[1] || '');
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

// =============================================================================
// Gerar pacote ZIP completo
// =============================================================================
export interface ExportOptions {
  includeRecognition: boolean;
  includePhotoReport: boolean;
  includeInvestigation: boolean;
  includePhotos: boolean;
  includeJSON: boolean;
  packageName: string;
}

export const generateExportPackage = async (
  caseData: Case,
  options: ExportOptions
): Promise<Blob> => {
  const zip = new JSZip();

  // Criar estrutura de pastas
  const reconhecimento = zip.folder('Reconhecimento');
  const relatorioFotografico = zip.folder('Relatorio_Fotografico');
  const relatorioInvestigacao = zip.folder('Relatorio_Investigacao');
  const fotos = zip.folder('Fotos');
  const metadata = zip.folder('Metadata');

  // Adicionar Reconhecimento
  if (options.includeRecognition && reconhecimento) {
    const html = generateRecognitionHTML(caseData);
    reconhecimento.file('reconhecimento.html', html);
    reconhecimento.file('README.txt', 'Abra o arquivo reconhecimento.html em um navegador e use Ctrl+P para imprimir como PDF.');
  }

  // Adicionar Relatório Fotográfico
  if (options.includePhotoReport && relatorioFotografico) {
    const html = generatePhotoReportHTML(caseData);
    relatorioFotografico.file('relatorio_fotografico.html', html);
    relatorioFotografico.file('README.txt', 'Abra o arquivo relatorio_fotografico.html em um navegador e use Ctrl+P para imprimir como PDF.');
  }

  // Adicionar Relatório de Investigação
  if (options.includeInvestigation && relatorioInvestigacao) {
    const html = generateInvestigationReportHTML(caseData);
    relatorioInvestigacao.file('relatorio_investigacao.html', html);
    relatorioInvestigacao.file('README.txt', 'Abra o arquivo relatorio_investigacao.html em um navegador e use Ctrl+P para imprimir como PDF.');
  }

  // Adicionar Fotos
  if (options.includePhotos && fotos) {
    caseData.photos.forEach((photo, index) => {
      if (photo.fileData) {
        try {
          const blob = base64ToBlob(photo.fileData);
          const extension = photo.mimeType.split('/')[1] || 'jpg';
          const fileName = `foto_${String(index + 1).padStart(3, '0')}_${photo.confirmedCategory || photo.suggestedCategory || 'sem_categoria'}.${extension}`;
          fotos.file(fileName, blob);
        } catch (e) {
          console.error('Erro ao adicionar foto:', e);
        }
      }
    });

    // Índice de fotos
    const photoIndex = caseData.photos
      .map(
        (p, i) =>
          `Foto ${i + 1}: ${p.fileName} | Categoria: ${p.confirmedCategory || p.suggestedCategory || '-'} | Confirmada: ${p.confirmed ? 'Sim' : 'Não'}`
      )
      .join('\n');
    fotos.file('indice_fotos.txt', photoIndex);
  }

  // Adicionar JSON de metadados
  if (options.includeJSON && metadata) {
    const caseJSON = generateCaseJSON(caseData);
    metadata.file('case.json', JSON.stringify(caseJSON, null, 2));

    // Adicionar README
    metadata.file(
      'README.txt',
      `
CaseHub - Pacote de Exportação
=============================

BO: ${caseData.bo}
Natureza: ${caseData.natureza}
Data do Fato: ${caseData.dataHoraFato}
Data de Exportação: ${new Date().toISOString()}

Conteúdo do Pacote:
- /Reconhecimento: Documento HTML do reconhecimento visuográfico
- /Relatorio_Fotografico: Documento HTML do relatório fotográfico
- /Relatorio_Investigacao: Documento HTML do relatório de investigação
- /Fotos: Todas as fotos do caso
- /Metadata: Arquivo JSON com todos os dados e metadados do caso

Instruções:
1. Os arquivos HTML podem ser abertos em qualquer navegador
2. Use Ctrl+P (ou Cmd+P no Mac) para imprimir como PDF
3. O arquivo case.json contém todos os dados estruturados do caso
4. O auditLog registra todas as ações realizadas no caso

Rastreabilidade:
Todos os campos incluem informações sobre:
- Status (sugerido pela IA, confirmado, editado)
- Nível de confiança da IA
- Fontes das informações
- Data/hora da última atualização
- Responsável pela confirmação/edição

Este pacote foi gerado pelo CaseHub v1.0
    `.trim()
    );
  }

  // Gerar arquivo ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
};

// =============================================================================
// Download do pacote ZIP
// =============================================================================
export const downloadExportPackage = async (
  caseData: Case,
  options: ExportOptions
): Promise<void> => {
  try {
    const blob = await generateExportPackage(caseData, options);

    // Criar link de download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${options.packageName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar pacote:', error);
    throw error;
  }
};
