import { FileDown, Save, Check, Sparkles, Eye, Link } from 'lucide-react';
import { useState } from 'react';

export function RecognitionScreen() {
  const [activeSection, setActiveSection] = useState('preliminary');

  const sections = [
    { id: 'preliminary', label: 'Informações Preliminares' },
    { id: 'communications', label: 'Comunicações e Eventos' },
    { id: 'team', label: 'Equipe / Órgão' },
    { id: 'weather', label: 'Clima / Iluminação' },
    { id: 'location', label: 'Local / Acesso' },
    { id: 'evidences', label: 'Vestígios' },
  ];

  const formFields = [
    { label: 'Boletim de Ocorrência', value: 'BO 2025/123456', badge: 'Confirmado', confidence: null, source: null },
    { label: 'Natureza', value: 'Homicídio', badge: 'Confirmado', confidence: null, source: null },
    { label: 'Data do Fato', value: '05/01/2025', badge: 'Editado', confidence: null, source: null },
    { label: 'Hora do Fato', value: '14:30', badge: 'IA sugeriu', confidence: 0.87, source: 'Foto 1, 3' },
    { label: 'Endereço Completo', value: 'Rua das Flores, 123 - Centro, São Paulo/SP', badge: 'Confirmado', confidence: null, source: null },
    { label: 'CEP', value: '01310-100', badge: 'IA sugeriu', confidence: 0.92, source: 'Foto 1' },
  ];

  const relatedFields = [
    { field: 'Data/Hora do Fato', usedIn: ['Relatório Fotográfico', 'Relatório de Investigação'] },
    { field: 'Endereço', usedIn: ['Relatório de Investigação'] },
    { field: 'Natureza', usedIn: ['Relatório Fotográfico', 'Relatório de Investigação'] },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'IA sugeriu':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmado':
        return 'bg-green-100 text-green-800';
      case 'Editado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Reconhecimento Visuográfico</h1>
          <p className="text-sm text-gray-600">
            Preencha os campos do formulário técnico. Dados confirmados serão reutilizados automaticamente.
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
        {/* Stepper / Sections Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
            <h2 className="text-sm mb-4">Seções</h2>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm mb-6">Informações Preliminares</h2>

            <div className="space-y-6">
              {formFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">{field.label}</label>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getBadgeColor(field.badge)}`}>
                        {field.badge}
                      </span>
                      {field.confidence && (
                        <span className="text-xs text-gray-500">{Math.round(field.confidence * 100)}%</span>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={field.value}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    readOnly
                  />

                  {field.source && (
                    <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                      <Eye className="w-3 h-3" />
                      Ver fonte ({field.source})
                    </button>
                  )}

                  {field.badge === 'IA sugeriu' && (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Confirmar
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* More fields placeholder */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">+ 12 campos adicionais...</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Cancelar
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Finalizar Seção
              </button>
            </div>
          </div>
        </div>

        {/* Related Fields Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
            <h2 className="text-sm mb-4 flex items-center gap-2">
              <Link className="w-4 h-4" />
              Campos Relacionados
            </h2>
            <p className="text-xs text-gray-600 mb-4">
              Veja onde os dados preenchidos aqui serão reutilizados automaticamente:
            </p>

            <div className="space-y-4">
              {relatedFields.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-900 mb-2">{item.field}</p>
                  <div className="space-y-1">
                    {item.usedIn.map((doc, docIndex) => (
                      <div key={docIndex} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full" />
                        <span className="text-xs text-gray-600">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-xs text-blue-900 flex items-start gap-2">
                <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
                Preencha uma vez, reutilize em todos os documentos automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
