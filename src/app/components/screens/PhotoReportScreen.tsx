import { FileDown, Save, Plus, GripVertical, Settings2, Layout, FileText, Eye } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';

export function PhotoReportScreen() {
  const [selectedPhotos, setSelectedPhotos] = useState([
    { id: '1', caption: 'Vista panorâmica do local do fato, demonstrando a Rua das Flores em direção ao norte.' },
    { id: '2', caption: 'Detalhe do acesso principal ao imóvel nº 123, com portão metálico azul.' },
    { id: '3', caption: 'Vestígio encontrado próximo à entrada: mancha hemática no piso.' },
    { id: '4', caption: 'Numeração fotográfica indicando vestígio nº 01.' },
  ]);

  const [layout, setLayout] = useState<'1' | '2'>('1');

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedPhotos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedPhotos(items);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Relatório Fotográfico</h1>
          <p className="text-sm text-gray-600">
            Selecione e ordene as fotos, adicione legendas e gere o relatório em PDF.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar no Caso
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
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
                    onClick={() => setLayout('1')}
                    className={`px-3 py-1 border rounded text-xs transition-colors ${
                      layout === '1'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    1 por página
                  </button>
                  <button
                    onClick={() => setLayout('2')}
                    className={`px-3 py-1 border rounded text-xs transition-colors ${
                      layout === '2'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    2 por página
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="cover" className="rounded" />
                <label htmlFor="cover" className="text-sm text-gray-700">Incluir capa</label>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="header" className="rounded" defaultChecked />
                <label htmlFor="header" className="text-sm text-gray-700">Cabeçalho/rodapé institucional</label>
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
              <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">
                <Plus className="w-3 h-3" />
                Adicionar Fotos
              </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="photos">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {selectedPhotos.map((photo, index) => (
                      <Draggable key={photo.id} draggableId={photo.id} index={index}>
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
                              <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                                Foto {photo.id}
                              </div>

                              {/* Content */}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Foto {index + 1}</span>
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    Panorâmica
                                  </span>
                                </div>
                                <textarea
                                  value={photo.caption}
                                  onChange={(e) => {
                                    const newPhotos = [...selectedPhotos];
                                    newPhotos[index].caption = e.target.value;
                                    setSelectedPhotos(newPhotos);
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  rows={2}
                                  placeholder="Digite a legenda..."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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
                  <div className="text-xs text-gray-600">BO 2025/123456</div>
                </div>
                <h3 className="text-sm text-center">RELATÓRIO FOTOGRÁFICO</h3>
              </div>

              {/* Photo Content */}
              <div className="bg-white rounded p-4 space-y-4">
                <div className="aspect-[4/3] bg-gray-200 rounded flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-700 mb-1">Foto 01</p>
                  <p className="text-xs text-gray-600">
                    Vista panorâmica do local do fato, demonstrando a Rua das Flores em direção ao norte.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white rounded p-2 mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Página 1 de {selectedPhotos.length}</span>
                  <span>05/01/2025</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-900">
              As fotos serão incluídas na ordem definida na lista à esquerda. Arraste para reordenar.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
