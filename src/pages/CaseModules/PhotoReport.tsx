/**
 * PhotoReport.tsx - Módulo de Relatório Fotográfico (ETAPA 12)
 *
 * Integrado com o módulo Capture. Permite:
 * - Selecionar imagens capturadas
 * - Adicionar legendas
 * - Reordenar itens do relatório
 * - Persistir automaticamente
 */

import { useParams } from 'react-router-dom';
import { Image, Plus, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useCaptureStore } from '../../state/captureStore';
import { usePhotoReportStore } from '../../state/photoReportStore';

export function PhotoReportModule() {
  const { caseId } = useParams<{ caseId: string }>();
  const [addingImage, setAddingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stores
  const captureImages = useCaptureStore((state) => state.getImages(caseId || ''));
  const reportItems = usePhotoReportStore((state) => state.getReport(caseId || ''));
  const { addItem, updateItem, removeItem, reorder } = usePhotoReportStore();

  if (!caseId) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erro: ID do caso não encontrado</p>
        </div>
      </div>
    );
  }

  // Imagens disponíveis para adicionar (não estão no relatório)
  const availableImages = captureImages.filter(
    (img) => !reportItems.some((item) => item.imageId === img.id)
  );

  // Ordena itens por order
  const sortedItems = [...reportItems].sort((a, b) => a.order - b.order);

  const handleAddImage = (imageId: string) => {
    try {
      addItem(caseId, imageId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar imagem');
    }
  };

  const handleUpdateCaption = (itemId: string, caption: string) => {
    try {
      updateItem(caseId, itemId, { caption });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar legenda');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      removeItem(caseId, itemId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover item');
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sortedItems];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    reorder(caseId, newOrder.map((item) => item.id));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedItems.length - 1) return;
    const newOrder = [...sortedItems];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    reorder(caseId, newOrder.map((item) => item.id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Image className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Relatório Fotográfico</h1>
        </div>
        <p className="text-gray-600">Caso #{caseId}</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Available Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Imagens Disponíveis</h2>
              <p className="text-sm text-gray-600 mt-1">
                {availableImages.length} imagem(ns) pronta(s) para adicionar
              </p>
            </div>

            <div className="p-4">
              {availableImages.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    {captureImages.length === 0
                      ? 'Nenhuma imagem capturada. Vá para o módulo de Captura para adicionar fotos.'
                      : 'Todas as imagens capturadas já estão no relatório.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {availableImages.map((image) => (
                    <div
                      key={image.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover bg-gray-100"
                      />
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate" title={image.name}>
                          {image.name}
                        </p>
                        <button
                          onClick={() => handleAddImage(image.id)}
                          className="mt-2 w-full px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Report Items */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Relatório</h2>
              <p className="text-sm text-gray-600 mt-1">
                {sortedItems.length} item(ns)
              </p>
            </div>

            <div className="p-4">
              {sortedItems.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Relatório vazio. Adicione imagens ao lado.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedItems.map((item, index) => {
                    const image = captureImages.find((img) => img.id === item.imageId);
                    return (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                        {/* Imagem */}
                        {image && (
                          <img
                            src={image.url}
                            alt="Report item"
                            className="w-full h-24 object-cover rounded mb-2 bg-gray-100"
                          />
                        )}

                        {/* Legenda */}
                        <input
                          type="text"
                          value={item.caption}
                          onChange={(e) => handleUpdateCaption(item.id, e.target.value)}
                          placeholder="Adicionar legenda..."
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />

                        {/* Controls */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === sortedItems.length - 1}
                            className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="flex-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
