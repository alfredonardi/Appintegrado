import { FileDown, Save, Check, Sparkles, Eye, Link, Edit2, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseStore, useSelectedCase } from '../state';
import {
  RECOGNITION_SECTIONS,
  CANONICAL_FIELDS,
  getFieldByKey,
  getFieldReuse,
} from '../types/fieldRegistry';
import { generateRecognitionPDF } from '../services/pdfService';
import { FieldStatus } from '../types/case';



export function RecognitionScreen() {
  const selectedCase = useSelectedCase();
  const { setFieldValue, confirmField, editField, addAuditEvent } = useCaseStore();

  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('preliminary');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!selectedCase) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-lg text-gray-600 mb-2">Nenhum caso selecionado</h2>
          <p className="text-sm text-gray-500 mb-4">Selecione um caso para editar o reconhecimento.</p>
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

  const sections = [
    { id: 'preliminary', label: 'Informações Preliminares' },
    { id: 'communications', label: 'Comunicações' },
    { id: 'team', label: 'Equipe' },
    { id: 'weather', label: 'Condições Climáticas' },
    { id: 'location', label: 'Localização' },
    { id: 'evidence', label: 'Vestígios e Evidências' },
  ];

  // Get fields for current section
  const currentSectionDef = RECOGNITION_SECTIONS[activeSection as keyof typeof RECOGNITION_SECTIONS];
  const sectionFields = currentSectionDef?.fields || [];

  // Get field value from store
  const getFieldFromStore = (key: string) => {
    return selectedCase.fieldValues.find((f) => f.key === key);
  };

  // Get display value for a field
  const getDisplayValue = (key: string): string => {
    const field = getFieldFromStore(key);
    if (field) return field.value;

    // Fallback to case direct properties
    switch (key) {
      case 'case.bo':
        return selectedCase.bo;
      case 'case.natureza':
        return selectedCase.natureza;
      case 'case.dataHoraFato':
        return new Date(selectedCase.dataHoraFato).toLocaleString('pt-BR');
      case 'location.endereco':
        return selectedCase.endereco;
      case 'location.cep':
        return selectedCase.cep || '';
      case 'location.circunscricao':
        return selectedCase.circunscricao || '';
      case 'location.unidade':
        return selectedCase.unidade || '';
      default:
        return '';
    }
  };

  // Handle confirm field
  const handleConfirm = (key: string) => {
    const currentValue = getDisplayValue(key);
    if (currentValue) {
      setFieldValue(key, currentValue, 'confirmed');
    }
  };

  // Handle start editing
  const handleStartEdit = (key: string) => {
    setEditingField(key);
    setEditValue(getDisplayValue(key));
  };

  // Handle save edit
  const handleSaveEdit = (key: string) => {
    if (editValue.trim()) {
      editField(key, editValue.trim());
    }
    setEditingField(null);
    setEditValue('');
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  // Get badge info
  const getBadgeInfo = (key: string) => {
    const field = getFieldFromStore(key);
    if (!field) return { label: 'Não preenchido', color: 'bg-gray-100 text-gray-600' };

    switch (field.status) {
      case 'confirmed':
        return { label: 'Confirmado', color: 'bg-green-100 text-green-800' };
      case 'edited':
        return { label: 'Editado', color: 'bg-blue-100 text-blue-800' };
      case 'suggested':
        return { label: 'IA sugeriu', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: 'Não preenchido', color: 'bg-gray-100 text-gray-600' };
    }
  };

  // Handle generate PDF
  const handleGeneratePDF = () => {
    generateRecognitionPDF(selectedCase);
    addAuditEvent('PDF_GENERATED', { type: 'recognition' });
  };

  // Get related fields for sidebar
  const getRelatedFields = () => {
    const importantFields = ['case.dataHoraFato', 'location.endereco', 'case.natureza', 'case.bo'];
    return importantFields.map((key) => {
      const fieldDef = getFieldByKey(key);
      const usedIn = getFieldReuse(key)
        .filter((screen) => screen !== 'recognition')
        .map((screen) => {
          switch (screen) {
            case 'photoReport':
              return 'Relatório Fotográfico';
            case 'investigationReport':
              return 'Relatório de Investigação';
            case 'export':
              return 'Exportação';
            default:
              return screen;
          }
        });
      return {
        field: fieldDef?.label || key,
        usedIn,
      };
    });
  };

  const relatedFields = getRelatedFields();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Reconhecimento Visuográfico</h1>
          <p className="text-sm text-gray-600">
            BO {selectedCase.bo} - Preencha os campos do formulário técnico. Dados confirmados serão reutilizados automaticamente.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
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
        {/* Sections Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
            <h2 className="text-sm font-medium mb-4">Seções</h2>
            <nav className="space-y-1">
              {sections.map((section) => {
                const sectionDef = RECOGNITION_SECTIONS[section.id as keyof typeof RECOGNITION_SECTIONS];
                const sectionFieldKeys = sectionDef?.fields || [];
                const filledCount = sectionFieldKeys.filter((key) => {
                  const field = getFieldFromStore(key);
                  return field && (field.status === 'confirmed' || field.status === 'edited');
                }).length;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{section.label}</span>
                    {sectionFieldKeys.length > 0 && (
                      <span
                        className={`text-xs ${
                          activeSection === section.id ? 'text-blue-200' : 'text-gray-400'
                        }`}
                      >
                        {filledCount}/{sectionFieldKeys.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-medium mb-6">
              {sections.find((s) => s.id === activeSection)?.label}
            </h2>

            <div className="space-y-6">
              {sectionFields.map((fieldKey) => {
                const fieldDef = getFieldByKey(fieldKey);
                if (!fieldDef) return null;

                const fieldValue = getFieldFromStore(fieldKey);
                const displayValue = getDisplayValue(fieldKey);
                const badge = getBadgeInfo(fieldKey);
                const isEditing = editingField === fieldKey;

                return (
                  <div key={fieldKey} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">{fieldDef.label}</label>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${badge.color}`}>
                          {badge.label}
                        </span>
                        {fieldValue?.confidence && (
                          <span className="text-xs text-gray-500">
                            {Math.round(fieldValue.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex gap-2">
                        {fieldDef.type === 'select' && fieldDef.options ? (
                          <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 border border-blue-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          >
                            <option value="">Selecione...</option>
                            {fieldDef.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : fieldDef.type === 'textarea' ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 border border-blue-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            autoFocus
                          />
                        ) : (
                          <input
                            type={fieldDef.type === 'datetime' ? 'datetime-local' : 'text'}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 border border-blue-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        )}
                        <button
                          onClick={() => handleSaveEdit(fieldKey)}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={displayValue}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                          readOnly
                          placeholder="Não preenchido"
                        />

                        {fieldValue?.sources && fieldValue.sources.length > 0 && (
                          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                            <Eye className="w-3 h-3" />
                            Ver fonte ({fieldValue.sources.join(', ')})
                          </button>
                        )}

                        <div className="flex gap-2">
                          {fieldValue?.status === 'suggested' ? (
                            <>
                              <button
                                onClick={() => handleConfirm(fieldKey)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Confirmar
                              </button>
                              <button
                                onClick={() => handleStartEdit(fieldKey)}
                                className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                Editar
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(fieldKey)}
                              className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              {displayValue ? 'Editar' : 'Preencher'}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => onNavigate('workspace')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Voltar
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
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
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

            {/* Stats */}
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Campos confirmados:</span>
                  <span className="font-medium text-green-600">
                    {selectedCase.fieldValues.filter((f) => f.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sugestões IA:</span>
                  <span className="font-medium text-yellow-600">
                    {selectedCase.fieldValues.filter((f) => f.status === 'suggested').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
