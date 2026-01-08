import { FileDown, Save, Plus, Sparkles, Tag, Image, FileText, Calendar, User, Check, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseStore, useSelectedCase } from '../state';
import { generateInvestigationReportPDF } from '../services/pdfService';
import { getFieldByKey } from '../types/fieldRegistry';



export function InvestigationReportScreen() {
  const selectedCase = useSelectedCase();
  const {
    updateReportBlock,
    setBlockAIGenerated,
    confirmBlockContent,
    setReportSignatures,
    addAuditEvent,
    currentUser,
  } = useCaseStore();

  const navigate = useNavigate();
  const [activeBlock, setActiveBlock] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddReferenceModal, setShowAddReferenceModal] = useState(false);

  if (!selectedCase) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-lg text-gray-600 mb-2">Nenhum caso selecionado</h2>
          <p className="text-sm text-gray-500 mb-4">Selecione um caso para editar o relatório de investigação.</p>
          <button
            onClick={() => onNavigate('cases')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Ir para Lista de Casos
          </button>
        </div>
      </div>
    );
  }

  const { blocks, signatures, lastUpdated } = selectedCase.investigationReport;
  const confirmedFields = selectedCase.fieldValues.filter(
    (f) => f.status === 'confirmed' || f.status === 'edited'
  );
  const confirmedPhotos = selectedCase.photos.filter((p) => p.confirmed);

  const getCurrentBlock = () => blocks.find((b) => b.id === activeBlock) || blocks[0];
  const currentBlock = getCurrentBlock();

  // Get status badge info
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmado', color: 'bg-green-100 text-green-800' };
      case 'ai_generated':
        return { label: 'Gerado por IA', color: 'bg-purple-100 text-purple-800' };
      case 'draft':
        return { label: 'Rascunho', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: 'Vazio', color: 'bg-gray-100 text-gray-600' };
    }
  };

  // Handle block content change
  const handleContentChange = (content: string) => {
    updateReportBlock(
      activeBlock,
      content,
      currentBlock.referencedFieldKeys,
      currentBlock.referencedPhotoIds
    );
  };

  // Handle clear content
  const handleClearContent = () => {
    if (confirm('Tem certeza que deseja limpar o conteúdo deste bloco?')) {
      updateReportBlock(activeBlock, '', [], []);
    }
  };

  // Simulate AI generation based on confirmed fields
  const handleGenerateWithAI = async () => {
    if (confirmedFields.length === 0) {
      alert('Não há campos confirmados para gerar o texto. Confirme alguns campos primeiro.');
      return;
    }

    setIsGenerating(true);

    // Simulate AI delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate content based on block type and confirmed fields
    let generatedContent = '';
    const usedFieldKeys: string[] = [];

    switch (activeBlock) {
      case 'summary':
        generatedContent = `RESUMO DO FATO\n\n`;
        if (confirmedFields.find((f) => f.key === 'case.bo')) {
          generatedContent += `Trata-se de ${selectedCase.natureza || 'ocorrência'} registrada sob o BO nº ${selectedCase.bo}. `;
          usedFieldKeys.push('case.bo', 'case.natureza');
        }
        if (confirmedFields.find((f) => f.key === 'case.dataHoraFato')) {
          const date = new Date(selectedCase.dataHoraFato);
          generatedContent += `O fato ocorreu em ${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. `;
          usedFieldKeys.push('case.dataHoraFato');
        }
        if (confirmedFields.find((f) => f.key === 'location.endereco')) {
          generatedContent += `Local: ${selectedCase.endereco}. `;
          usedFieldKeys.push('location.endereco');
        }
        break;

      case 'dynamics':
        generatedContent = `DINÂMICA PRELIMINAR\n\n`;
        generatedContent += `Conforme apurado preliminarmente, `;
        const iluminacao = confirmedFields.find((f) => f.key === 'environment.iluminacao');
        const tipoVia = confirmedFields.find((f) => f.key === 'environment.tipoVia');
        if (iluminacao) {
          generatedContent += `o local apresentava iluminação ${iluminacao.value.toLowerCase()}. `;
          usedFieldKeys.push('environment.iluminacao');
        }
        if (tipoVia) {
          generatedContent += `Trata-se de ${tipoVia.value.toLowerCase()}. `;
          usedFieldKeys.push('environment.tipoVia');
        }
        generatedContent += `\n\nOs elementos colhidos no local serão detalhados nas seções seguintes.`;
        break;

      case 'police':
        generatedContent = `ATUAÇÃO POLICIAL\n\n`;
        if (selectedCase.team.length > 0) {
          generatedContent += `A equipe responsável pelo atendimento foi composta por:\n\n`;
          selectedCase.team.forEach((member) => {
            generatedContent += `- ${member.role}: ${member.name}${member.badge ? ` (RE ${member.badge})` : ''}\n`;
          });
        }
        if (selectedCase.events.length > 0) {
          generatedContent += `\nCronologia:\n\n`;
          selectedCase.events.forEach((event) => {
            const time = new Date(event.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            generatedContent += `- ${time}: ${event.label}${event.description ? ` - ${event.description}` : ''}\n`;
          });
        }
        break;

      case 'cameras':
        generatedContent = `CÂMERAS IDENTIFICADAS\n\n`;
        const cameras = confirmedFields.find((f) => f.key === 'security.cameras');
        if (cameras) {
          generatedContent += cameras.value === 'Sim'
            ? `Foram identificadas câmeras de segurança nas proximidades do local do fato. Recomenda-se a requisição das imagens para análise.`
            : `Não foram identificadas câmeras de segurança nas proximidades do local do fato.`;
          usedFieldKeys.push('security.cameras');
        } else {
          generatedContent += `A verificação quanto à existência de câmeras de segurança nas proximidades será realizada em momento oportuno.`;
        }
        break;

      default:
        generatedContent = `${currentBlock.title.toUpperCase()}\n\n`;
        generatedContent += `[Conteúdo a ser preenchido com base nas investigações em andamento.]`;
    }

    setBlockAIGenerated(activeBlock, generatedContent);
    addAuditEvent('BLOCK_AI_GENERATED', { blockId: activeBlock, fieldKeysUsed: usedFieldKeys });
    setIsGenerating(false);
  };

  // Handle confirm block
  const handleConfirmBlock = () => {
    confirmBlockContent(activeBlock);
  };

  // Handle add field reference
  const handleAddFieldReference = (fieldKey: string) => {
    if (!currentBlock.referencedFieldKeys.includes(fieldKey)) {
      updateReportBlock(
        activeBlock,
        currentBlock.content,
        [...currentBlock.referencedFieldKeys, fieldKey],
        currentBlock.referencedPhotoIds
      );
    }
  };

  // Handle add photo reference
  const handleAddPhotoReference = (photoId: string) => {
    if (!currentBlock.referencedPhotoIds.includes(photoId)) {
      updateReportBlock(
        activeBlock,
        currentBlock.content,
        currentBlock.referencedFieldKeys,
        [...currentBlock.referencedPhotoIds, photoId]
      );
    }
  };

  // Handle remove reference
  const handleRemoveFieldReference = (fieldKey: string) => {
    updateReportBlock(
      activeBlock,
      currentBlock.content,
      currentBlock.referencedFieldKeys.filter((k) => k !== fieldKey),
      currentBlock.referencedPhotoIds
    );
  };

  const handleRemovePhotoReference = (photoId: string) => {
    updateReportBlock(
      activeBlock,
      currentBlock.content,
      currentBlock.referencedFieldKeys,
      currentBlock.referencedPhotoIds.filter((id) => id !== photoId)
    );
  };

  // Handle save
  const handleSave = () => {
    addAuditEvent('INVESTIGATION_REPORT_SAVED', {
      blocksWithContent: blocks.filter((b) => b.content.length > 0).length,
    });
    alert('Relatório salvo no caso!');
  };

  // Handle generate PDF
  const handleGeneratePDF = () => {
    generateInvestigationReportPDF(selectedCase);
    addAuditEvent('PDF_GENERATED', { type: 'investigation' });
  };

  // Calculate progress
  const filledBlocks = blocks.filter((b) => b.content.length > 50).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Relatório Preliminar de Investigação</h1>
          <p className="text-sm text-gray-600">
            BO {selectedCase.bo} - Preencha os blocos estruturados do relatório. Use a IA para gerar rascunhos baseados em dados confirmados.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Rascunho
          </button>
          <button
            onClick={handleGeneratePDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Gerar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Blocks Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
            <h2 className="text-sm mb-4">Blocos do Relatório</h2>
            <nav className="space-y-1">
              {blocks.map((block) => {
                const statusBadge = getStatusBadge(block.status);
                return (
                  <button
                    key={block.id}
                    onClick={() => setActiveBlock(block.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between ${
                      activeBlock === block.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="truncate">{block.title}</span>
                    {block.content.length > 0 && (
                      <span
                        className={`ml-2 w-2 h-2 rounded-full flex-shrink-0 ${
                          activeBlock === block.id
                            ? 'bg-white'
                            : block.status === 'confirmed'
                            ? 'bg-green-500'
                            : block.status === 'ai_generated'
                            ? 'bg-purple-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-gray-500">
                Progresso: {filledBlocks}/{blocks.length} blocos
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${(filledBlocks / blocks.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm">{currentBlock.title}</h2>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(currentBlock.status).color}`}>
                  {getStatusBadge(currentBlock.status).label}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 flex items-center gap-1 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  {isGenerating ? 'Gerando...' : 'Gerar Rascunho com IA'}
                </button>
                <button
                  onClick={() => setShowAddReferenceModal(true)}
                  className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Inserir Referência
                </button>
                {currentBlock.status === 'ai_generated' && (
                  <button
                    onClick={handleConfirmBlock}
                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Confirmar
                  </button>
                )}
              </div>
            </div>

            {/* Editor Area */}
            <div className="mb-6">
              <textarea
                value={currentBlock.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Digite o conteúdo deste bloco ou use a IA para gerar um rascunho..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{currentBlock.content.length} caracteres</span>
                <button
                  onClick={handleClearContent}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Limpar conteúdo
                </button>
              </div>
            </div>

            {/* Referenced Fields */}
            {currentBlock.referencedFieldKeys.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm mb-3">Campos Referenciados</h3>
                <div className="flex flex-wrap gap-2">
                  {currentBlock.referencedFieldKeys.map((fieldKey) => {
                    const fieldDef = getFieldByKey(fieldKey);
                    return (
                      <span
                        key={fieldKey}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        {fieldDef?.label || fieldKey}
                        <button
                          onClick={() => handleRemoveFieldReference(fieldKey)}
                          className="ml-1 hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Referenced Photos */}
            {currentBlock.referencedPhotoIds.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm mb-3">Fotos Referenciadas</h3>
                <div className="flex flex-wrap gap-2">
                  {currentBlock.referencedPhotoIds.map((photoId) => {
                    const photo = selectedCase.photos.find((p) => p.id === photoId);
                    return (
                      <span
                        key={photoId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                      >
                        <Image className="w-3 h-3" />
                        {photo?.fileName || photoId}
                        <button
                          onClick={() => handleRemovePhotoReference(photoId)}
                          className="ml-1 hover:text-green-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Evidence */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm mb-3">Evidências Disponíveis</h3>
              <div className="grid grid-cols-2 gap-3">
                {confirmedFields.slice(0, 2).map((field) => {
                  const fieldDef = getFieldByKey(field.key);
                  return (
                    <button
                      key={field.key}
                      onClick={() => handleAddFieldReference(field.key)}
                      disabled={currentBlock.referencedFieldKeys.includes(field.key)}
                      className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <div className="text-left flex-1 overflow-hidden">
                        <p className="text-xs text-gray-900 truncate">{fieldDef?.label || field.key}</p>
                        <p className="text-xs text-gray-500 truncate">{field.value}</p>
                      </div>
                    </button>
                  );
                })}
                {confirmedPhotos.slice(0, 2).map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => handleAddPhotoReference(photo.id)}
                    disabled={currentBlock.referencedPhotoIds.includes(photo.id)}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Image className="w-4 h-4 text-gray-600" />
                    <div className="text-left flex-1 overflow-hidden">
                      <p className="text-xs text-gray-900 truncate">{photo.fileName}</p>
                      <p className="text-xs text-gray-500 capitalize">{photo.confirmedCategory || photo.suggestedCategory}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            <h3 className="text-sm mb-4">Assinaturas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-2">Responsável 1 - Nome</label>
                <input
                  type="text"
                  value={signatures.responsible1Name || ''}
                  onChange={(e) => setReportSignatures({ responsible1Name: e.target.value })}
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Responsável 1 - Cargo</label>
                <input
                  type="text"
                  value={signatures.responsible1Role || ''}
                  onChange={(e) => setReportSignatures({ responsible1Role: e.target.value })}
                  placeholder="Ex: Delegado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Responsável 2 - Nome</label>
                <input
                  type="text"
                  value={signatures.responsible2Name || ''}
                  onChange={(e) => setReportSignatures({ responsible2Name: e.target.value })}
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Responsável 2 - Cargo</label>
                <input
                  type="text"
                  value={signatures.responsible2Role || ''}
                  onChange={(e) => setReportSignatures({ responsible2Role: e.target.value })}
                  placeholder="Ex: Escrivão"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Local</label>
                <input
                  type="text"
                  value={signatures.location || ''}
                  onChange={(e) => setReportSignatures({ location: e.target.value })}
                  placeholder="São Paulo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Data</label>
                <input
                  type="date"
                  value={signatures.date || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setReportSignatures({ date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onNavigate('workspace')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Sidebar - Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6 space-y-4">
            <div>
              <h3 className="text-sm mb-3">Informações do Relatório</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Última atualização</p>
                    <p className="text-xs text-gray-900">
                      {lastUpdated ? new Date(lastUpdated).toLocaleString('pt-BR') : 'Nunca'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Autor</p>
                    <p className="text-xs text-gray-900">{currentUser}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Blocos preenchidos</p>
                    <p className="text-xs text-gray-900">{filledBlocks} de {blocks.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm mb-3">Dados Disponíveis</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Campos confirmados:</span>
                  <span className="font-medium text-green-600">{confirmedFields.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fotos classificadas:</span>
                  <span className="font-medium text-blue-600">{confirmedPhotos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Membros da equipe:</span>
                  <span className="font-medium">{selectedCase.team.length}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm mb-3">Dicas</h3>
              <div className="space-y-2">
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-xs text-purple-900 flex items-start gap-2">
                    <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    Use "Gerar Rascunho com IA" para criar texto baseado apenas em dados confirmados.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-blue-900 flex items-start gap-2">
                    <Tag className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    Referencie fatos e evidências para garantir rastreabilidade completa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Reference Modal */}
      {showAddReferenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddReferenceModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Adicionar Referência</h2>
              <button onClick={() => setShowAddReferenceModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Fields */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Campos Confirmados</h3>
                {confirmedFields.length === 0 ? (
                  <p className="text-xs text-gray-500">Nenhum campo confirmado disponível.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {confirmedFields.map((field) => {
                      const fieldDef = getFieldByKey(field.key);
                      const isAdded = currentBlock.referencedFieldKeys.includes(field.key);
                      return (
                        <button
                          key={field.key}
                          onClick={() => {
                            handleAddFieldReference(field.key);
                          }}
                          disabled={isAdded}
                          className={`flex items-center gap-3 p-3 border rounded text-left transition-colors ${
                            isAdded
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-200 hover:border-blue-500'
                          }`}
                        >
                          <Tag className="w-4 h-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{fieldDef?.label || field.key}</p>
                            <p className="text-xs text-gray-500 truncate">{field.value}</p>
                          </div>
                          {isAdded && <Check className="w-4 h-4 text-green-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Photos */}
              <div>
                <h3 className="text-sm font-medium mb-3">Fotos Classificadas</h3>
                {confirmedPhotos.length === 0 ? (
                  <p className="text-xs text-gray-500">Nenhuma foto classificada disponível.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {confirmedPhotos.map((photo) => {
                      const isAdded = currentBlock.referencedPhotoIds.includes(photo.id);
                      return (
                        <button
                          key={photo.id}
                          onClick={() => {
                            handleAddPhotoReference(photo.id);
                          }}
                          disabled={isAdded}
                          className={`flex items-center gap-2 p-2 border rounded text-left transition-colors ${
                            isAdded
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-200 hover:border-blue-500'
                          }`}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                            {photo.fileData ? (
                              <img src={photo.fileData} alt={photo.fileName} className="w-full h-full object-cover" />
                            ) : (
                              <Image className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs text-gray-900 truncate">{photo.fileName}</p>
                            <p className="text-xs text-gray-500 capitalize">{photo.confirmedCategory}</p>
                          </div>
                          {isAdded && <Check className="w-4 h-4 text-green-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-end">
              <button
                onClick={() => setShowAddReferenceModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
