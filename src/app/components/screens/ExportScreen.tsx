import { Package, FileText, Image, FileSearch, FolderArchive, Download, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCaseStore, useSelectedCase } from '../../../store';
import { downloadExportPackage, ExportOptions } from '../../../services/exportService';

interface ExportScreenProps {
  onNavigate: (screen: string) => void;
}

interface ExportItem {
  id: string;
  name: string;
  status: 'complete' | 'incomplete' | 'optional';
  icon: React.ComponentType<{ className?: string }>;
  optionKey: keyof ExportOptions;
}

export function ExportScreen({ onNavigate }: ExportScreenProps) {
  const selectedCase = useSelectedCase();
  const { addAuditEvent, calculateRecognitionProgress, calculatePhotoReportProgress, calculateInvestigationProgress } = useCaseStore();

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [packageName, setPackageName] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({
    recognition: true,
    photo: true,
    investigation: true,
    photos: true,
    json: true,
  });

  if (!selectedCase) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-lg text-gray-600 mb-2">Nenhum caso selecionado</h2>
          <p className="text-sm text-gray-500 mb-4">Selecione um caso para exportar.</p>
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

  // Calculate progress for each document
  const recognitionProgress = calculateRecognitionProgress();
  const photoReportProgress = calculatePhotoReportProgress();
  const investigationProgress = calculateInvestigationProgress();

  // Determine status for each item
  const items: ExportItem[] = useMemo(() => [
    {
      id: 'recognition',
      name: 'PDF Reconhecimento Visuográfico',
      status: recognitionProgress >= 50 ? 'complete' : 'incomplete',
      icon: FileText,
      optionKey: 'includeRecognition' as keyof ExportOptions,
    },
    {
      id: 'photo',
      name: 'PDF Relatório Fotográfico',
      status: selectedCase.photoReport.selectedPhotos.length > 0 ? 'complete' : 'incomplete',
      icon: Image,
      optionKey: 'includePhotoReport' as keyof ExportOptions,
    },
    {
      id: 'investigation',
      name: 'PDF Relatório de Investigação',
      status: investigationProgress >= 30 ? 'complete' : 'incomplete',
      icon: FileSearch,
      optionKey: 'includeInvestigation' as keyof ExportOptions,
    },
    {
      id: 'photos',
      name: `Anexos (${selectedCase.photos.length} Fotos)`,
      status: selectedCase.photos.length > 0 ? 'complete' : 'incomplete',
      icon: FolderArchive,
      optionKey: 'includePhotos' as keyof ExportOptions,
    },
    {
      id: 'json',
      name: 'JSON do Caso (Metadados)',
      status: 'optional',
      icon: FileText,
      optionKey: 'includeJSON' as keyof ExportOptions,
    },
  ], [recognitionProgress, investigationProgress, selectedCase.photoReport.selectedPhotos.length, selectedCase.photos.length]);

  // Generate default package name
  const defaultPackageName = useMemo(() => {
    const bo = selectedCase.bo.replace(/\//g, '_');
    const natureza = (selectedCase.natureza || 'CASO').toUpperCase().replace(/\s+/g, '_');
    return `BO_${bo}_${natureza}_PACOTE_COMPLETO`;
  }, [selectedCase.bo, selectedCase.natureza]);

  // Calculate summary stats
  const totalFiles = useMemo(() => {
    let count = 0;
    if (selectedItems.recognition) count += 1;
    if (selectedItems.photo) count += 1;
    if (selectedItems.investigation) count += 1;
    if (selectedItems.photos) count += selectedCase.photos.length;
    if (selectedItems.json) count += 1;
    return count;
  }, [selectedItems, selectedCase.photos.length]);

  // Estimate size (rough estimate based on photos)
  const estimatedSize = useMemo(() => {
    let size = 0.1; // Base size for HTML/JSON files (MB)
    if (selectedItems.photos) {
      // Estimate ~1MB per photo (rough average)
      size += selectedCase.photos.length * 1;
    }
    return size.toFixed(1);
  }, [selectedItems, selectedCase.photos.length]);

  // Check for incomplete items
  const incompleteSelected = items
    .filter((item) => selectedItems[item.id] && item.status === 'incomplete')
    .map((item) => item.name);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'complete':
        return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Completo' };
      case 'incomplete':
        return { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Incompleto' };
      case 'optional':
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Opcional' };
      default:
        return { icon: CheckCircle2, color: 'text-gray-600', bg: 'bg-gray-50', label: '' };
    }
  };

  const handleToggleItem = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const options: ExportOptions = {
        includeRecognition: selectedItems.recognition,
        includePhotoReport: selectedItems.photo,
        includeInvestigation: selectedItems.investigation,
        includePhotos: selectedItems.photos,
        includeJSON: selectedItems.json,
        packageName: packageName || defaultPackageName,
      };

      await downloadExportPackage(selectedCase, options);

      addAuditEvent('PACKAGE_EXPORTED', {
        packageName: options.packageName,
        includedItems: Object.entries(selectedItems)
          .filter(([, v]) => v)
          .map(([k]) => k),
        totalFiles,
      });
    } catch (error) {
      console.error('Export error:', error);
      setExportError('Ocorreu um erro ao gerar o pacote. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-1">Exportar Pacote</h1>
        <p className="text-sm text-gray-600">
          BO {selectedCase.bo} - Gere um pacote completo com todos os documentos do caso para compartilhamento ou arquivamento.
        </p>
      </div>

      <div className="space-y-6">
        {/* Checklist */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm mb-4">Documentos do Pacote</h2>
          <div className="space-y-3">
            {items.map((item) => {
              const Icon = item.icon;
              const config = getStatusConfig(item.status);
              const StatusIcon = config.icon;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 ${config.bg} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusIcon className={`w-3 h-3 ${config.color}`} />
                      <span className={`text-xs ${config.color}`}>{config.label}</span>
                      {item.status !== 'optional' && (
                        <span className="text-xs text-gray-400">
                          ({item.id === 'recognition' ? recognitionProgress : item.id === 'investigation' ? investigationProgress : photoReportProgress}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedItems[item.id]}
                    onChange={() => handleToggleItem(item.id)}
                    className="w-4 h-4 rounded"
                  />
                </div>
              );
            })}
          </div>

          {/* Warning for incomplete items */}
          {incompleteSelected.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-900 mb-1">Atenção</p>
                <p className="text-xs text-yellow-800">
                  Os seguintes documentos estão incompletos: {incompleteSelected.join(', ')}.
                  Complete-os antes de gerar o pacote final, ou desmarque para continuar.
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {exportError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-900 mb-1">Erro</p>
                <p className="text-xs text-red-800">{exportError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Package Name */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm mb-4">Configurações do Pacote</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 block mb-2">Nome do Pacote</label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder={defaultPackageName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                O pacote será salvo como arquivo ZIP com este nome
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-700 block mb-2">Formato</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                defaultValue="zip"
              >
                <option value="zip">ZIP (Recomendado)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm mb-4">Resumo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total de Arquivos</p>
              <p className="text-xl">{totalFiles}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tamanho Estimado</p>
              <p className="text-xl">{estimatedSize} MB</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">BO</p>
              <p className="text-sm text-gray-900">{selectedCase.bo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Data de Geração</p>
              <p className="text-sm text-gray-900">{new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>

          {/* Case Stats */}
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-medium text-green-600">
                {selectedCase.fieldValues.filter((f) => f.status === 'confirmed' || f.status === 'edited').length}
              </p>
              <p className="text-xs text-gray-500">Campos Confirmados</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-blue-600">
                {selectedCase.photos.filter((p) => p.confirmed).length}
              </p>
              <p className="text-xs text-gray-500">Fotos Classificadas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-purple-600">
                {selectedCase.auditLog.length}
              </p>
              <p className="text-xs text-gray-500">Eventos de Auditoria</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting || totalFiles === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Gerar e Baixar Pacote
                </>
              )}
            </button>
            <button
              onClick={() => onNavigate('workspace')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Voltar ao Caso
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            O pacote será gerado e baixado automaticamente para seu computador.
          </p>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex gap-3">
            <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900 mb-1">Sobre o Pacote de Exportação</p>
              <p className="text-xs text-blue-800">
                O pacote incluirá todos os documentos selecionados organizados em pastas, mantendo a rastreabilidade completa.
                Metadados sobre origem dos dados, confiança da IA e responsáveis pelas confirmações serão incluídos no arquivo JSON.
              </p>
            </div>
          </div>
        </div>

        {/* Audit Trail Info */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-900 mb-1">Rastreabilidade</p>
              <p className="text-xs text-gray-600">
                O arquivo JSON incluirá o log completo de auditoria com {selectedCase.auditLog.length} eventos registrados,
                permitindo verificar toda a cadeia de custódia dos dados desde a captura até a exportação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
