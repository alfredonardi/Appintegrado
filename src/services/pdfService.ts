// =============================================================================
// PDF Service - Geração de PDFs (MVP com stubs)
// =============================================================================

import { Case, FieldValue } from '../types/case';
import { getFieldByKey } from '../types/fieldRegistry';

// Helper para formatar data
const formatDate = (isoDate: string): string => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// Helper para pegar valor do campo
const getFieldValueFromCase = (caseData: Case, key: string): string => {
  const field = caseData.fieldValues.find((f) => f.key === key);
  return field?.value || '';
};

// =============================================================================
// Gerar HTML para Reconhecimento
// =============================================================================
export const generateRecognitionHTML = (caseData: Case): string => {
  const confirmedFields = caseData.fieldValues.filter(
    (f) => f.status === 'confirmed' || f.status === 'edited'
  );

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reconhecimento Visuográfico - BO ${caseData.bo}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .header h1 { font-size: 18px; margin: 0; }
        .header h2 { font-size: 14px; margin: 5px 0; color: #666; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 14px; font-weight: bold; background: #f0f0f0; padding: 8px; margin-bottom: 10px; }
        .field { display: flex; margin-bottom: 8px; }
        .field-label { width: 150px; font-weight: bold; color: #333; }
        .field-value { flex: 1; }
        .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #666; }
        .signature { margin-top: 60px; display: flex; justify-content: space-around; }
        .signature-line { text-align: center; }
        .signature-line .line { border-top: 1px solid #333; width: 200px; margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>RECONHECIMENTO VISUOGRÁFICO</h1>
        <h2>Polícia Civil do Estado de São Paulo</h2>
        <p>BO ${caseData.bo} - ${caseData.natureza}</p>
      </div>

      <div class="section">
        <div class="section-title">INFORMAÇÕES PRELIMINARES</div>
        <div class="field">
          <span class="field-label">Boletim de Ocorrência:</span>
          <span class="field-value">${caseData.bo}</span>
        </div>
        <div class="field">
          <span class="field-label">Natureza:</span>
          <span class="field-value">${caseData.natureza}</span>
        </div>
        <div class="field">
          <span class="field-label">Data/Hora do Fato:</span>
          <span class="field-value">${formatDate(caseData.dataHoraFato)}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">LOCALIZAÇÃO</div>
        <div class="field">
          <span class="field-label">Endereço:</span>
          <span class="field-value">${caseData.endereco}</span>
        </div>
        <div class="field">
          <span class="field-label">CEP:</span>
          <span class="field-value">${caseData.cep || '-'}</span>
        </div>
        <div class="field">
          <span class="field-label">Circunscrição:</span>
          <span class="field-value">${caseData.circunscricao || '-'}</span>
        </div>
        <div class="field">
          <span class="field-label">Unidade:</span>
          <span class="field-value">${caseData.unidade || '-'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">CONDIÇÕES AMBIENTAIS</div>
        ${confirmedFields
          .filter((f) => f.key.startsWith('environment.'))
          .map((f) => {
            const fieldDef = getFieldByKey(f.key);
            return `
            <div class="field">
              <span class="field-label">${fieldDef?.label || f.key}:</span>
              <span class="field-value">${f.value}</span>
            </div>
          `;
          })
          .join('')}
      </div>

      <div class="section">
        <div class="section-title">EQUIPE</div>
        ${caseData.team
          .map(
            (member) => `
          <div class="field">
            <span class="field-label">${member.role}:</span>
            <span class="field-value">${member.name}</span>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="section">
        <div class="section-title">EVENTOS DE CAMPO</div>
        ${caseData.events
          .map(
            (event) => `
          <div class="field">
            <span class="field-label">${event.label}:</span>
            <span class="field-value">${formatDate(event.timestamp)}</span>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="signature">
        <div class="signature-line">
          <div class="line"></div>
          <p>Responsável Técnico</p>
        </div>
        <div class="signature-line">
          <div class="line"></div>
          <p>Autoridade Policial</p>
        </div>
      </div>

      <div class="footer">
        <p>Documento gerado em ${formatDate(new Date().toISOString())} | CaseHub v1.0</p>
        <p>Este documento faz parte do processo BO ${caseData.bo}</p>
      </div>
    </body>
    </html>
  `;
};

// =============================================================================
// Gerar HTML para Relatório Fotográfico
// =============================================================================
export const generatePhotoReportHTML = (caseData: Case): string => {
  const { selectedPhotos, layout } = caseData.photoReport;

  const photosWithData = selectedPhotos
    .map((sp) => {
      const photo = caseData.photos.find((p) => p.id === sp.photoId);
      return photo ? { ...sp, photo } : null;
    })
    .filter(Boolean);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Fotográfico - BO ${caseData.bo}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .header h1 { font-size: 18px; margin: 0; }
        .header h2 { font-size: 14px; margin: 5px 0; color: #666; }
        .photo-page { page-break-after: always; margin-bottom: 40px; }
        .photo-container { text-align: center; margin-bottom: 20px; }
        .photo-placeholder {
          width: 100%;
          max-width: 500px;
          height: 350px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .photo-caption {
          margin-top: 15px;
          font-size: 11px;
          text-align: center;
          font-style: italic;
        }
        .photo-number {
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 5px;
        }
        .footer { text-align: center; font-size: 10px; color: #666; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>RELATÓRIO FOTOGRÁFICO</h1>
        <h2>Polícia Civil do Estado de São Paulo</h2>
        <p>BO ${caseData.bo} - ${caseData.natureza}</p>
        <p>${caseData.endereco}</p>
        <p>Data do Fato: ${formatDate(caseData.dataHoraFato)}</p>
      </div>

      ${photosWithData
        .map(
          (item, index) => `
        <div class="photo-page">
          <div class="photo-number">Foto ${index + 1} de ${photosWithData.length}</div>
          <div class="photo-container">
            <div class="photo-placeholder">
              ${item?.photo?.fileData ? `<img src="${item.photo.fileData}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />` : '[IMAGEM]'}
            </div>
          </div>
          <div class="photo-caption">${item?.caption || 'Sem legenda'}</div>
        </div>
      `
        )
        .join('')}

      <div class="footer">
        <p>Total de ${photosWithData.length} fotos | Documento gerado em ${formatDate(new Date().toISOString())}</p>
        <p>CaseHub v1.0</p>
      </div>
    </body>
    </html>
  `;
};

// =============================================================================
// Gerar HTML para Relatório de Investigação
// =============================================================================
export const generateInvestigationReportHTML = (caseData: Case): string => {
  const { blocks, signatures } = caseData.investigationReport;
  const confirmedFields = caseData.fieldValues.filter(
    (f) => f.status === 'confirmed' || f.status === 'edited'
  );

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Preliminar de Investigação - BO ${caseData.bo}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .header h1 { font-size: 18px; margin: 0; }
        .header h2 { font-size: 14px; margin: 5px 0; color: #666; }
        .info-box { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
        .info-box .row { display: flex; margin-bottom: 5px; }
        .info-box .label { width: 150px; font-weight: bold; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 14px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px; }
        .section-content { text-align: justify; }
        .references { font-size: 10px; color: #666; margin-top: 10px; font-style: italic; }
        .signature { margin-top: 60px; }
        .signature-row { display: flex; justify-content: space-around; margin-top: 40px; }
        .signature-line { text-align: center; }
        .signature-line .line { border-top: 1px solid #333; width: 200px; margin: 0 auto 5px; }
        .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>RELATÓRIO PRELIMINAR DE INVESTIGAÇÃO</h1>
        <h2>Polícia Civil do Estado de São Paulo</h2>
      </div>

      <div class="info-box">
        <div class="row">
          <span class="label">Boletim de Ocorrência:</span>
          <span>${caseData.bo}</span>
        </div>
        <div class="row">
          <span class="label">Natureza:</span>
          <span>${caseData.natureza}</span>
        </div>
        <div class="row">
          <span class="label">Data/Hora do Fato:</span>
          <span>${formatDate(caseData.dataHoraFato)}</span>
        </div>
        <div class="row">
          <span class="label">Local:</span>
          <span>${caseData.endereco}</span>
        </div>
      </div>

      ${blocks
        .filter((block) => block.content.length > 0)
        .map(
          (block) => `
        <div class="section">
          <div class="section-title">${block.title.toUpperCase()}</div>
          <div class="section-content">${block.content.replace(/\n/g, '<br>')}</div>
          ${
            block.referencedFieldKeys.length > 0
              ? `<div class="references">Referências: ${block.referencedFieldKeys
                  .map((key) => getFieldByKey(key)?.label || key)
                  .join(', ')}</div>`
              : ''
          }
        </div>
      `
        )
        .join('')}

      <div class="signature">
        <p style="text-align: center; margin-bottom: 5px;">${signatures.location || 'São Paulo'}, ${signatures.date || formatDate(new Date().toISOString()).split(' ')[0]}</p>
        <div class="signature-row">
          <div class="signature-line">
            <div class="line"></div>
            <p>${signatures.responsible1Name || '________________________'}</p>
            <p style="font-size: 10px;">${signatures.responsible1Role || 'Responsável'}</p>
          </div>
          <div class="signature-line">
            <div class="line"></div>
            <p>${signatures.responsible2Name || '________________________'}</p>
            <p style="font-size: 10px;">${signatures.responsible2Role || 'Responsável'}</p>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Documento gerado em ${formatDate(new Date().toISOString())} | CaseHub v1.0</p>
        <p>Este relatório foi elaborado com base em dados confirmados e rastreáveis.</p>
      </div>
    </body>
    </html>
  `;
};

// =============================================================================
// Função para gerar PDF (usa window.print() no navegador)
// =============================================================================
export const openPrintableDocument = (html: string, title: string): void => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.document.title = title;
    // Trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

// =============================================================================
// Funções de geração de PDF para cada documento
// =============================================================================
export const generateRecognitionPDF = (caseData: Case): void => {
  const html = generateRecognitionHTML(caseData);
  openPrintableDocument(html, `Reconhecimento_BO_${caseData.bo}`);
};

export const generatePhotoReportPDF = (caseData: Case): void => {
  const html = generatePhotoReportHTML(caseData);
  openPrintableDocument(html, `Relatorio_Fotografico_BO_${caseData.bo}`);
};

export const generateInvestigationReportPDF = (caseData: Case): void => {
  const html = generateInvestigationReportHTML(caseData);
  openPrintableDocument(html, `Relatorio_Investigacao_BO_${caseData.bo}`);
};
