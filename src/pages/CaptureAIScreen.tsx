import { Upload, Camera, Grid3x3, Filter, Check, Edit, X, Eye, Sparkles, Info, Trash2 } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { useCaseStore, useSelectedCase } from '../state';
import { PhotoCategory, PhotoEvidence } from '../types';
import { getFieldByKey } from '../types/fieldRegistry';

interface CaptureAIScreenProps {
  onNavigate: (screen: string) => void;
}

// Simular extrações de IA para fotos (MVP sem backend)
const simulateAIExtractions = () => {
  const extractions = [
    { fieldKey: 'environment.iluminacao', value: 'Artificial (noite)', confidence: 0.87 },
    { fieldKey: 'environment.tipoVia', value: 'Via pública (asfalto)', confidence: 0.92 },
    { fieldKey: 'environment.clima', value: 'Céu limpo', confidence: 0.78 },
    { fieldKey: 'security.cameras', value: 'Sim', confidence: 0.65 },
  ];
  return extractions[Math.floor(Math.random() * extractions.length)];
};

// Simular categoria de foto
const simulatePhotoCategory = (): { category: PhotoCategory; confidence: number } => {
  const categories: Array<{ category: PhotoCategory; confidence: number }> = [
    { category: 'panoramica', confidence: 0.94 },
    { category: 'vestigios', confidence: 0.87 },
    { category: 'acesso', confidence: 0.91 },
    { category: 'numeracao', confidence: 0.96 },
    { category: 'detalhes', confidence: 0.82 },
  ];
  return categories[Math.floor(Math.random() * categories.length)];
};

const categoryLabels: Record<PhotoCategory, string> = {
  panoramica: 'Panorâmica',
  vestigios: 'Vestígios',
  acesso: 'Acesso',
  numeracao: 'Numeração',
  detalhes: 'Detalhes',
  vitima: 'Vítima',
  arma: 'Arma',
  outros: 'Outros',
};

export function CaptureAIScreen({ onNavigate }: CaptureAIScreenProps) {
  const selectedCase = useSelectedCase();
  const {
    addPhoto,
    updatePhoto,
    deletePhoto,
    confirmPhotoCategory,
    addAIExtraction,
    confirmAIExtraction,
    dismissAIExtraction,
    confirmField,
    editField,
  } = useCaseStore();

  const [showOnlyConfirmed, setShowOnlyConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingExtraction, setEditingExtraction] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedCase) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-lg text-gray-600 mb-2">Nenhum caso selecionado</h2>
          <p className="text-sm text-gray-500 mb-4">Selecione um caso para importar fotos.</p>
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

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      setIsProcessing(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        // Convert to base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const simulated = simulatePhotoCategory();

          // Add photo to store
          const photoId = addPhoto({
            fileName: file.name,
            fileData: base64,
            mimeType: file.type,
            suggestedCategory: simulated.category,
            confidence: simulated.confidence,
            tags: [],
            confirmed: false,
          });

          // Simulate AI extraction for this photo
          const extraction = simulateAIExtractions();
          addAIExtraction({
            fieldKey: extraction.fieldKey,
            suggestedValue: extraction.value,
            confidence: extraction.confidence,
            sourceEvidenceIds: [photoId],
            status: 'pending',
          });
        };
        reader.readAsDataURL(file);
      }

      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    },
    [addPhoto, addAIExtraction]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleConfirmCategory = (photoId: string) => {
    const photo = selectedCase.photos.find((p) => p.id === photoId);
    if (photo && photo.suggestedCategory) {
      confirmPhotoCategory(photoId, photo.suggestedCategory);
    }
  };

  const handleConfirmExtraction = (extractionId: string) => {
    confirmAIExtraction(extractionId);
  };

  const handleEditExtraction = (extractionId: string, fieldKey: string) => {
    const extraction = selectedCase.aiExtractions.find((e) => e.id === extractionId);
    if (extraction) {
      setEditingExtraction(extractionId);
      setEditValue(extraction.suggestedValue);
    }
  };

  const handleSaveEdit = (extractionId: string, fieldKey: string) => {
    editField(fieldKey, editValue);
    dismissAIExtraction(extractionId);
    setEditingExtraction(null);
    setEditValue('');
  };

  const handleDismissExtraction = (extractionId: string) => {
    dismissAIExtraction(extractionId);
  };

  // Filter photos
  const filteredPhotos = selectedCase.photos.filter((photo) => {
    if (categoryFilter === 'all') return true;
    return photo.confirmedCategory === categoryFilter || photo.suggestedCategory === categoryFilter;
  });

  // Get field values for extractions
  const pendingExtractions = selectedCase.aiExtractions.filter((e) => e.status === 'pending');
  const confirmedExtractions = selectedCase.aiExtractions.filter((e) => e.status === 'confirmed');

  const displayExtractions = showOnlyConfirmed ? confirmedExtractions : selectedCase.aiExtractions.filter((e) => e.status !== 'dismissed');

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
      <div
        className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 mb-6 hover:border-blue-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />
        <div className="text-center">
          {isProcessing ? (
            <>
              <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <h3 className="text-sm mb-2">Processando fotos com IA...</h3>
              <p className="text-xs text-gray-500">Classificando e extraindo informações</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm mb-2">Arraste fotos aqui ou clique para selecionar</h3>
              <p className="text-xs text-gray-500 mb-4">Suporta JPG, PNG, HEIC - Máx. 50MB por arquivo</p>
              <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Selecionar Arquivos
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Abrir Câmera
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photos Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Galeria de Fotos ({selectedCase.photos.length})</h2>
              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Todas as categorias</option>
                  <option value="panoramica">Panorâmica</option>
                  <option value="vestigios">Vestígios</option>
                  <option value="acesso">Acesso</option>
                  <option value="numeracao">Numeração</option>
                  <option value="detalhes">Detalhes</option>
                </select>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50">
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPhotos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    {/* Photo Image */}
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      {photo.fileData ? (
                        <img
                          src={photo.fileData}
                          alt={photo.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          {photo.fileName}
                        </div>
                      )}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => setSelectedPhotoId(photo.id)}
                        className="p-2 bg-white rounded-full mr-2 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="p-2 bg-white rounded-full hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          photo.confirmed ? 'bg-green-600' : 'bg-yellow-600'
                        }`}
                      >
                        {categoryLabels[photo.confirmedCategory || photo.suggestedCategory || 'outros']}
                      </span>
                    </div>

                    {/* Confidence */}
                    {photo.confidence && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black bg-opacity-70 text-white rounded text-xs">
                          {Math.round(photo.confidence * 100)}%
                        </span>
                      </div>
                    )}

                    {/* Status Icon */}
                    {photo.confirmed ? (
                      <div className="absolute bottom-2 right-2">
                        <div className="p-1 bg-green-600 rounded-full">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute bottom-2 left-2 right-2">
                        <button
                          onClick={() => handleConfirmCategory(photo.id)}
                          className="w-full px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          Confirmar categoria
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Nenhuma foto importada ainda</p>
                <p className="text-xs text-gray-400 mt-1">Arraste fotos ou clique para fazer upload</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-blue-600">{selectedCase.photos.length}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">
                  {selectedCase.photos.filter((p) => p.confirmed).length}
                </p>
                <p className="text-xs text-gray-500">Confirmadas</p>
              </div>
              <div>
                <p className="text-xl font-bold text-yellow-600">{pendingExtractions.length}</p>
                <p className="text-xs text-gray-500">Pendentes</p>
              </div>
            </div>
          </div>

          {/* Extractions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium flex items-center gap-2">
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

            {displayExtractions.length > 0 ? (
              <div className="space-y-3">
                {displayExtractions.map((extraction) => {
                  const fieldDef = getFieldByKey(extraction.fieldKey);
                  const isEditing = editingExtraction === extraction.id;

                  return (
                    <div key={extraction.id} className="p-3 border border-gray-200 rounded">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">
                            {fieldDef?.label || extraction.fieldKey}
                          </p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full px-2 py-1 border border-blue-500 rounded text-sm"
                              autoFocus
                            />
                          ) : (
                            <p className="text-sm text-gray-900">{extraction.suggestedValue}</p>
                          )}
                        </div>
                        {extraction.status === 'confirmed' && (
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              extraction.confidence >= 0.8
                                ? 'bg-green-600'
                                : extraction.confidence >= 0.6
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}
                            style={{ width: `${extraction.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round(extraction.confidence * 100)}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Fonte: {extraction.sourceEvidenceIds.length} foto(s)
                        </span>
                      </div>

                      {extraction.status === 'pending' && (
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(extraction.id, extraction.fieldKey)}
                                className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={() => setEditingExtraction(null)}
                                className="flex-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleConfirmExtraction(extraction.id)}
                                className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center justify-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Aceitar
                              </button>
                              <button
                                onClick={() => handleEditExtraction(extraction.id, extraction.fieldKey)}
                                className="flex-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center justify-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                Editar
                              </button>
                              <button
                                onClick={() => handleDismissExtraction(extraction.id)}
                                className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 hover:border-red-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nenhuma extração disponível</p>
                <p className="text-xs text-gray-400 mt-1">Importe fotos para a IA analisar</p>
              </div>
            )}

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
