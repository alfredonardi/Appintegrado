import { FileDown, Save, Plus, GripVertical, Settings2, Layout, FileText, Eye, X, Check, Image } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useState } from 'react';
import { useCaseStore, useSelectedCase } from '../../../store';
import { generatePhotoReportPDF } from '../../../services/pdfService';
import { PhotoEvidence } from '../../../types/case';

interface PhotoReportScreenProps {
  onNavigate: (screen: string) => void;
}

export function PhotoReportScreen({ onNavigate }: PhotoReportScreenProps) {
  const selectedCase = useSelectedCase();
  const {
    setPhotoReportSelection,
    updatePhotoCaption,
    setPhotoReportLayout,
    setPhotoReportOptions,
    addAuditEvent,
  } = useCaseStore();

  const [showAddModal, setShowAddModal] = useState(false);

  if (!selectedCase) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-lg text-gray-600 mb-2">Nenhum caso selecionado</h2>
          <p className="text-sm text-gray-500 mb-4">Selecione um caso para editar o relatório fotográfico.</p>
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

  // Get photo report data from store
  const { selectedPhotos, layout, includeCover, includeHeaderFooter } = selectedCase.photoReport;
  const allPhotos = selectedCase.photos;

  // Photos not yet in the report
  const availablePhotos = allPhotos.filter(
    (photo) => !selectedPhotos.some((sp) => sp.photoId === photo.id)
  );

  // Get photo data by ID
  const getPhotoById = (photoId: string): PhotoEvidence | undefined => {
    return allPhotos.find((p) => p.id === photoId);
  };

  // Get category label
  const getCategoryLabel = (photo: PhotoEvidence | undefined): string => {
    if (!photo) return 'Sem categoria';
    const category = photo.confirmedCategory || photo.suggestedCategory;
    switch (category) {
      case 'panoramica':
        return 'Panorâmica';
      case 'acesso':
        return 'Acesso';
      case 'vestigios':
        return 'Vestígios';
      case 'numeracao':
        return 'Numeração';
      case 'detalhe':
        return 'Detalhe';
      default:
        return 'Sem categoria';
    }
  };

  // Handle drag end
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedPhotos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const reorderedWithOrder = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setPhotoReportSelection(reorderedWithOrder);
  };

  // Handle caption change
  const handleCaptionChange = (photoId: string, caption: string) => {
    updatePhotoCaption(photoId, caption);
  };

  // Handle layout change
  const handleLayoutChange = (newLayout: '1-per-page' | '2-per-page') => {
    setPhotoReportLayout(newLayout);
  };

  // Handle add photo to report
  const handleAddPhoto = (photoId: string) => {
    const newSelection = [
      ...selectedPhotos,
      {
        photoId,
        order: selectedPhotos.length,
        caption: '',
      },
    ];
    setPhotoReportSelection(newSelection);
  };

  // Handle remove photo from report
  const handleRemovePhoto = (photoId: string) => {
    const newSelection = selectedPhotos
      .filter((sp) => sp.photoId !== photoId)
      .map((sp, index) => ({ ...sp, order: index }));
    setPhotoReportSelection(newSelection);
  };

  // Handle save
  const handleSave = () => {
    addAuditEvent('PHOTO_REPORT_SAVED', {
      photoCount: selectedPhotos.length,
      layout,
    });
    // Show toast or feedback
    alert('Relatório fotográfico salvo no caso!');
  };

  // Handle generate PDF
  const handleGeneratePDF = () => {
    generatePhotoReportPDF(selectedCase);
    addAuditEvent('PDF_GENERATED', { type: 'photo-report' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Relatório Fotográfico</h1>
          <p className="text-sm text-gray-600">
            BO {selectedCase.bo} - Selecione e ordene as fotos, adicione legendas e gere o relatório em PDF.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar no Caso
          </button>
          <button
            onClick={handleGeneratePDF}
            disabled={selectedPhotos.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="w-4 h-4" />
            Gerar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Photo List */}
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm mb-3">Controles</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Layout</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLayoutChange('1-per-page')}
                    className={`px-3 py-1 border rounded text-xs transition-colors ${
                      layout === '1-per-page'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    1 por página
                  </button>
                  <button
                    onClick={() => handleLayoutChange('2-per-page')}
                    className={`px-3 py-1 border rounded text-xs transition-colors ${
                      layout === '2-per-page'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    2 por página
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cover"
                  className="rounded"
                  checked={includeCover}
                  onChange={(e) => setPhotoReportOptions({ includeCover: e.target.checked })}
                />
                <label htmlFor="cover" className="text-sm text-gray-700">
                  Incluir capa
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="header"
                  className="rounded"
                  checked={includeHeaderFooter}
                  onChange={(e) => setPhotoReportOptions({ includeHeaderFooter: e.target.checked })}
                />
                <label htmlFor="header" className="text-sm text-gray-700">
                  Cabeçalho/rodapé institucional
                </label>
              </div>

              <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
                <Settings2 className="w-4 h-4" />
                Configurações Avançadas
              </button>
            </div>
          </div>

          {/* Photo List */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm">Fotos Selecionadas ({selectedPhotos.length})</h2>
              <button
                onClick={() => setShowAddModal(true)}
                disabled={availablePhotos.length === 0}
                className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3 h-3" />
                Adicionar Fotos
              </button>
            </div>

            {selectedPhotos.length === 0 ? (
              <div className="py-8 text-center">
                <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">Nenhuma foto selecionada</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={availablePhotos.length === 0 && allPhotos.length === 0}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {allPhotos.length === 0 ? 'Importe fotos na tela de Captura' : 'Adicionar fotos ao relatório'}
                </button>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="photos">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {selectedPhotos.map((selectedPhoto, index) => {
                        const photo = getPhotoById(selectedPhoto.photoId);
                        return (
                          <Draggable key={selectedPhoto.photoId} draggableId={selectedPhoto.photoId} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border border-gray-200 rounded-lg p-3"
                              >
                                <div className="flex gap-3">
                                  {/* Drag Handle */}
                                  <div
                                    {...provided.dragHandleProps}
                                    className="flex items-center text-gray-400 cursor-move"
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>

                                  {/* Thumbnail */}
                                  <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    {photo?.fileData ? (
                                      <img
                                        src={photo.fileData}
                                        alt={photo.fileName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-gray-400 text-xs text-center">
                                        {photo?.fileName || 'Foto'}
                                      </span>
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Foto {index + 1}</span>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                          {getCategoryLabel(photo)}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => handleRemovePhoto(selectedPhoto.photoId)}
                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <textarea
                                      value={selectedPhoto.caption}
                                      onChange={(e) => handleCaptionChange(selectedPhoto.photoId, e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      rows={2}
                                      placeholder="Digite a legenda..."
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('workspace')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Right Column - PDF Preview */}
        <div className="sticky top-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm">Preview do PDF</h2>
              <div className="flex items-center gap-2">
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50">
                  <Layout className="w-4 h-4" />
                </button>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PDF Page Mock */}
            <div className="bg-gray-100 rounded-lg p-6 aspect-[8.5/11]">
              {/* Header */}
              <div className="bg-white rounded p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-600">Polícia Civil do Estado de São Paulo</div>
                  <div className="text-xs text-gray-600">BO {selectedCase.bo}</div>
                </div>
                <h3 className="text-sm text-center">RELATÓRIO FOTOGRÁFICO</h3>
              </div>

              {/* Photo Content */}
              <div className="bg-white rounded p-4 space-y-4">
                {selectedPhotos.length > 0 ? (
                  <>
                    <div className="aspect-[4/3] bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                      {(() => {
                        const firstPhoto = getPhotoById(selectedPhotos[0].photoId);
                        return firstPhoto?.fileData ? (
                          <img
                            src={firstPhoto.fileData}
                            alt={firstPhoto.fileName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <FileText className="w-12 h-12 text-gray-400" />
                        );
                      })()}
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-700 mb-1">Foto 01</p>
                      <p className="text-xs text-gray-600">
                        {selectedPhotos[0].caption || 'Legenda não definida'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="aspect-[4/3] bg-gray-200 rounded flex items-center justify-center">
                    <p className="text-xs text-gray-500">Selecione fotos para visualizar</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-white rounded p-2 mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    Página 1 de {selectedPhotos.length > 0 ? selectedPhotos.length : 1}
                  </span>
                  <span>{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-900">
              As fotos serão incluídas na ordem definida na lista à esquerda. Arraste para reordenar.
            </div>

            {/* Stats */}
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Total de fotos:</span>
                  <span className="font-medium">{selectedPhotos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Com legenda:</span>
                  <span className="font-medium text-green-600">
                    {selectedPhotos.filter((p) => p.caption.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sem legenda:</span>
                  <span className="font-medium text-yellow-600">
                    {selectedPhotos.filter((p) => p.caption.length === 0).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Photos Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Adicionar Fotos ao Relatório</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {availablePhotos.length === 0 ? (
              <div className="py-8 text-center">
                <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  {allPhotos.length === 0
                    ? 'Nenhuma foto importada no caso. Vá para a tela de Captura para importar fotos.'
                    : 'Todas as fotos já foram adicionadas ao relatório.'}
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availablePhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="border border-gray-200 rounded-lg p-2 hover:border-blue-500 transition-colors"
                    >
                      <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden">
                        {photo.fileData ? (
                          <img
                            src={photo.fileData}
                            alt={photo.fileName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate mb-1">{photo.fileName}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {getCategoryLabel(photo)}
                        </span>
                        <button
                          onClick={() => {
                            handleAddPhoto(photo.id);
                          }}
                          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Fechar
              </button>
              {availablePhotos.length > 0 && (
                <button
                  onClick={() => {
                    availablePhotos.forEach((photo) => handleAddPhoto(photo.id));
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Adicionar Todas ({availablePhotos.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
