import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, User, Building2, CheckCircle2, LogOut } from 'lucide-react';
import { useSelectedCase } from '../../state';
import { useCasesStore } from '../../state/casesStore';
import { useCaseStore } from '../../state/caseStore';
import { useAuth } from '../../state/auth';

/**
 * Header - Barra superior com busca, criar caso e indicadores
 * Usa React Router para navegação e Zustand para estado
 */
export function Header() {
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseBO, setNewCaseBO] = useState('');
  const [newCaseNatureza, setNewCaseNatureza] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { createCase: createCaseInStore, selectCase: selectCaseInStore } = useCaseStore();
  const { createCase, selectCase } = useCasesStore();
  const selectedCase = useSelectedCase();
  const { logout } = useAuth();
  const { currentUser } = useCaseStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Fazer logout local mesmo se falhar
      navigate('/login', { replace: true });
    }
  };

  const handleCreateCase = async () => {
    if (!newCaseBO.trim()) return;

    try {
      // Cria o caso via store (salva em API/mock)
      const newCase = await createCase(newCaseBO.trim(), newCaseNatureza.trim() || undefined);

      // Também adiciona ao caseStore (para gerenciar caso aberto)
      const localCaseId = createCaseInStore(newCaseBO.trim(), newCaseNatureza.trim() || undefined);
      selectCaseInStore(localCaseId);
      selectCase(newCase.id);

      setShowNewCaseModal(false);
      setNewCaseBO('');
      setNewCaseNatureza('');

      // Navegar para o workspace do novo caso
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error('Erro ao criar caso:', error);
    }
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

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline text-sm text-gray-700">{currentUser}</span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{currentUser}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
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
