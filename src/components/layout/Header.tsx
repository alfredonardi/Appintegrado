import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, User, Building2, CheckCircle2 } from 'lucide-react';
import { useCaseStore, useSelectedCase } from '../../state';

/**
 * Header - Barra superior com busca, criar caso e indicadores
 * Usa React Router para navegação
 */
export function Header() {
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseBO, setNewCaseBO] = useState('');
  const [newCaseNatureza, setNewCaseNatureza] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { createCase, selectCase, currentUser } = useCaseStore();
  const selectedCase = useSelectedCase();

  const handleCreateCase = () => {
    if (!newCaseBO.trim()) return;

    const caseId = createCase(newCaseBO.trim(), newCaseNatureza.trim() || undefined);
    selectCase(caseId);
    setShowNewCaseModal(false);
    setNewCaseBO('');
    setNewCaseNatureza('');

    // Navegar para o workspace do novo caso
    navigate(`/cases/${caseId}`);
  };

  const generateBO = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900000) + 100000;
    setNewCaseBO(`${year}/${random}`);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar casos, BO, endereço..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Current Case Indicator */}
        {selectedCase && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg mx-4">
            <span className="text-xs text-blue-600">Caso ativo:</span>
            <span className="text-xs text-blue-800 font-medium">BO {selectedCase.bo}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Novo Caso */}
          <button
            onClick={() => setShowNewCaseModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Caso
          </button>

          {/* Sync Status */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="hidden sm:inline">Sincronizado</span>
          </div>

          {/* Organization */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <Building2 className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">DPC - SP</span>
          </div>

          {/* User */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
            <User className="w-4 h-4 text-gray-600" />
            <span className="hidden sm:inline text-sm text-gray-700">{currentUser}</span>
          </div>
        </div>
      </header>

      {/* Modal de Novo Caso */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowNewCaseModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-medium mb-4">Criar Novo Caso</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Boletim de Ocorrência (BO) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCaseBO}
                    onChange={(e) => setNewCaseBO(e.target.value)}
                    placeholder="Ex: 2025/123456"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={generateBO}
                    type="button"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Gerar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Natureza</label>
                <select
                  value={newCaseNatureza}
                  onChange={(e) => setNewCaseNatureza(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="Homicídio">Homicídio</option>
                  <option value="Roubo">Roubo</option>
                  <option value="Furto">Furto</option>
                  <option value="Latrocínio">Latrocínio</option>
                  <option value="Lesão Corporal">Lesão Corporal</option>
                  <option value="Acidente de Trânsito">Acidente de Trânsito</option>
                  <option value="Incêndio">Incêndio</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCase}
                disabled={!newCaseBO.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar e Abrir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
