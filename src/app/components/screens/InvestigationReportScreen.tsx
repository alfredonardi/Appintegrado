import { FileDown, Save, Plus, Sparkles, Tag, Image, FileText, Calendar, User } from 'lucide-react';
import { useState } from 'react';

export function InvestigationReportScreen() {
  const [blocks, setBlocks] = useState([
    { id: 'summary', title: 'Resumo do Fato', content: '', facts: ['BO', 'Data/Hora', 'Endereço', 'Natureza'] },
    { id: 'dynamics', title: 'Dinâmica Preliminar', content: '', facts: [] },
    { id: 'victims', title: 'Vítimas/Envolvidos', content: '', facts: [] },
    { id: 'police', title: 'Atuação Policial', content: '', facts: ['Equipe', 'Eventos de Campo'] },
    { id: 'procedures', title: 'Providências e Diligências', content: '', facts: [] },
    { id: 'cameras', title: 'Câmeras Identificadas', content: '', facts: ['Iluminação', 'Tipo de Via'] },
    { id: 'conclusion', title: 'Conclusão Preliminar', content: '', facts: [] },
  ]);

  const [activeBlock, setActiveBlock] = useState('summary');

  const getCurrentBlock = () => blocks.find(b => b.id === activeBlock) || blocks[0];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Relatório Preliminar de Investigação</h1>
          <p className="text-sm text-gray-600">
            Preencha os blocos estruturados do relatório. Use a IA para gerar rascunhos baseados em dados confirmados.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Rascunho
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
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
              {blocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => setActiveBlock(block.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeBlock === block.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {block.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-sm mb-2">{getCurrentBlock().title}</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gerar Rascunho com IA
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  Inserir Evidência
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="mb-6">
              <textarea
                value={getCurrentBlock().content}
                onChange={(e) => {
                  const newBlocks = blocks.map(b =>
                    b.id === activeBlock ? { ...b, content: e.target.value } : b
                  );
                  setBlocks(newBlocks);
                }}
                placeholder="Digite o conteúdo deste bloco ou use a IA para gerar um rascunho..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{getCurrentBlock().content.length} caracteres</span>
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Limpar conteúdo
                </button>
              </div>
            </div>

            {/* Facts Used */}
            {getCurrentBlock().facts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm mb-3">Fatos Usados</h3>
                <div className="flex flex-wrap gap-2">
                  {getCurrentBlock().facts.map((fact, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      <Tag className="w-3 h-3" />
                      {fact}
                    </span>
                  ))}
                  <button className="inline-flex items-center gap-1 px-3 py-1 border border-dashed border-gray-300 text-gray-600 rounded-full text-xs hover:bg-gray-50">
                    <Plus className="w-3 h-3" />
                    Adicionar Referência
                  </button>
                </div>
              </div>
            )}

            {/* Evidence Examples */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm mb-3">Evidências Disponíveis</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  <Image className="w-4 h-4 text-gray-600" />
                  <div className="text-left flex-1">
                    <p className="text-xs text-gray-900">Foto 01</p>
                    <p className="text-xs text-gray-500">Panorâmica</p>
                  </div>
                </button>
                <button className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <div className="text-left flex-1">
                    <p className="text-xs text-gray-900">Reconhecimento</p>
                    <p className="text-xs text-gray-500">Campo: Iluminação</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            <h3 className="text-sm mb-4">Assinaturas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-2">Responsável 1</label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Responsável 2</label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Local</label>
                <input
                  type="text"
                  defaultValue="São Paulo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Data</label>
                <input
                  type="date"
                  defaultValue="2025-01-05"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
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
                    <p className="text-xs text-gray-500">Criado em</p>
                    <p className="text-xs text-gray-900">05/01/2025 16:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Autor</p>
                    <p className="text-xs text-gray-900">Dr. Carlos Silva</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Blocos preenchidos</p>
                    <p className="text-xs text-gray-900">3 de 7</p>
                  </div>
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
    </div>
  );
}
