import { Package, FileText, Image, FileSearch, FolderArchive, Download, Save, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export function ExportScreen() {
  const items = [
    { id: 'recognition', name: 'PDF Reconhecimento Visuográfico', status: 'complete', icon: FileText },
    { id: 'photo', name: 'PDF Relatório Fotográfico', status: 'complete', icon: Image },
    { id: 'investigation', name: 'PDF Relatório de Investigação', status: 'incomplete', icon: FileSearch },
    { id: 'photos', name: 'Anexos (Fotos Selecionadas)', status: 'complete', icon: FolderArchive },
    { id: 'json', name: 'JSON do Caso (Opcional)', status: 'optional', icon: FileText },
  ];

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-1">Exportar Pacote</h1>
        <p className="text-sm text-gray-600">
          Gere um pacote completo com todos os documentos do caso para compartilhamento ou arquivamento.
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
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={item.status === 'complete'}
                    disabled={item.status === 'incomplete'}
                    className="w-4 h-4 rounded"
                  />
                </div>
              );
            })}
          </div>

          {/* Warning */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-900 mb-1">Atenção</p>
              <p className="text-xs text-yellow-800">
                O Relatório de Investigação está incompleto. Complete-o antes de gerar o pacote final, ou desmarque para continuar.
              </p>
            </div>
          </div>
        </div>

        {/* Package Name */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm mb-4">Configurações do Pacote</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 block mb-2">Nome do Pacote</label>
              <input
                type="text"
                defaultValue="BO_2025_123456_HOMICIDIO_PACOTE_COMPLETO"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                O pacote será salvo como arquivo ZIP com este nome
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-700 block mb-2">Formato</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option>ZIP (Recomendado)</option>
                <option>RAR</option>
                <option>7Z</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="password" className="rounded" />
              <label htmlFor="password" className="text-sm text-gray-700">Proteger com senha</label>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm mb-4">Resumo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total de Arquivos</p>
              <p className="text-xl">7</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tamanho Estimado</p>
              <p className="text-xl">24.5 MB</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">BO</p>
              <p className="text-sm text-gray-900">2025/123456</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Data de Geração</p>
              <p className="text-sm text-gray-900">05/01/2025 17:45</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              Gerar Pacote
            </button>
            <button className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Baixar Imediatamente
            </button>
            <button className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Salvar no Storage
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            O pacote será gerado em segundo plano. Você será notificado quando estiver pronto.
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
      </div>
    </div>
  );
}
