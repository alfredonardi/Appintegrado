import { Upload, Camera, Grid3x3, Filter, Check, Edit, X, Eye, Sparkles, Info } from 'lucide-react';
import { useState } from 'react';

export function CaptureAIScreen() {
  const [showOnlyConfirmed, setShowOnlyConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const photos = [
    { id: 1, category: 'Panorâmica', confidence: 0.95, confirmed: true },
    { id: 2, category: 'Vestígios', confidence: 0.88, confirmed: true },
    { id: 3, category: 'Acesso', confidence: 0.72, confirmed: false },
    { id: 4, category: 'Numeração', confidence: 0.91, confirmed: true },
    { id: 5, category: 'Panorâmica', confidence: 0.84, confirmed: false },
    { id: 6, category: 'Vestígios', confidence: 0.93, confirmed: true },
  ];

  const aiExtractions = [
    { field: 'Iluminação', value: 'Natural - Dia', confidence: 0.92, source: 'Foto 1, 2, 4', status: 'pending' },
    { field: 'Tipo de Via', value: 'Via Pública - Rua Asfaltada', confidence: 0.87, source: 'Foto 1, 3', status: 'confirmed' },
    { field: 'Câmeras de Segurança', value: 'Não identificadas', confidence: 0.64, source: 'Foto 1, 5', status: 'pending' },
    { field: 'Condições Climáticas', value: 'Céu Limpo', confidence: 0.95, source: 'Foto 1, 2', status: 'confirmed' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Captura & IA</h1>
        <p className="text-sm text-gray-600">
          Faça upload de fotos ou capture novas imagens. A IA classificará automaticamente e extrairá informações.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 mb-6 hover:border-blue-400 transition-colors">
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm mb-2">Arraste fotos aqui ou clique para selecionar</h3>
          <p className="text-xs text-gray-500 mb-4">Suporta JPG, PNG, HEIC - Máx. 50MB por arquivo</p>
          <div className="flex items-center justify-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Selecionar Arquivos
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Abrir Câmera
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photos Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm">Galeria de Fotos</h2>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500">
                  <option>Todas as categorias</option>
                  <option>Panorâmica</option>
                  <option>Vestígios</option>
                  <option>Acesso</option>
                  <option>Numeração</option>
                </select>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50">
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  {/* Placeholder Image */}
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Foto {photo.id}
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="p-2 bg-white rounded-full mr-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-full">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      photo.confirmed ? 'bg-green-600' : 'bg-yellow-600'
                    }`}>
                      {photo.category}
                    </span>
                  </div>

                  {/* Confidence */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black bg-opacity-70 text-white rounded text-xs">
                      {Math.round(photo.confidence * 100)}%
                    </span>
                  </div>

                  {/* Status Icon */}
                  {photo.confirmed && (
                    <div className="absolute bottom-2 right-2">
                      <div className="p-1 bg-green-600 rounded-full">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Classification */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Classificação Automática
            </h2>

            {isProcessing ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-600">Processando IA...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-900">Categoria Sugerida</span>
                    <span className="text-xs text-gray-500">87%</span>
                  </div>
                  <p className="text-sm text-blue-600 mb-3">Panorâmica</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                      Aceitar
                    </button>
                    <button className="flex-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">
                      Alterar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Extractions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Extrações da IA
              </h2>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={showOnlyConfirmed}
                  onChange={() => setShowOnlyConfirmed(!showOnlyConfirmed)}
                  className="rounded"
                />
                Somente confirmados
              </label>
            </div>

            <div className="space-y-3">
              {aiExtractions
                .filter(item => !showOnlyConfirmed || item.status === 'confirmed')
                .map((item, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">{item.field}</p>
                        <p className="text-sm text-gray-900">{item.value}</p>
                      </div>
                      {item.status === 'confirmed' ? (
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(item.confidence * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Info className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Fonte: {item.source}</span>
                    </div>

                    {item.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center justify-center gap-1">
                          <Check className="w-3 h-3" />
                          Aceitar
                        </button>
                        <button className="flex-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center justify-center gap-1">
                          <Edit className="w-3 h-3" />
                          Editar
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900">
                Rastreabilidade ativada. Todas as confirmações são registradas com data, hora e responsável.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
