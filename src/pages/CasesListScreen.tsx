import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, FileText, Eye, Plus, Upload, Package, Trash2 } from 'lucide-react';
import { useCasesStore } from '../state';
import { CaseStatus } from '../types';



export function CasesListScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [naturezaFilter, setNaturezaFilter] = useState<string>('all');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseBO, setNewCaseBO] = useState('');
  const [newCaseNatureza, setNewCaseNatureza] = useState('');

  const { cases, loading, fetchCases, selectCase, createCase, deleteCase } = useCasesStore();

  // Carrega casos ao montar o componente
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Filtrar casos
  const filteredCases = cases.filter((caso) => {
    // Filtro de busca
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      caso.bo.toLowerCase().includes(searchLower) ||
      caso.natureza.toLowerCase().includes(searchLower) ||
      caso.endereco.toLowerCase().includes(searchLower);

    // Filtro de status
    const matchesStatus = statusFilter === 'all' || caso.status === statusFilter;

    // Filtro de natureza
    const matchesNatureza = naturezaFilter === 'all' || caso.natureza === naturezaFilter;

    return matchesSearch && matchesStatus && matchesNatureza;
  });

  const getStatusLabel = (status: CaseStatus) => {
    switch (status) {
      case 'rascunho':
        return 'Em rascunho';
      case 'em_revisao':
        return 'Em revisão';
      case 'finalizado':
        return 'Finalizado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case 'rascunho':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_revisao':
        return 'bg-blue-100 text-blue-800';
      case 'finalizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getRelativeTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  };

  const handleOpenCase = (caseId: string) => {
    selectCase(caseId);
    navigate(`/cases/${caseId}`);
  };

  const handleCreateCase = async () => {
    if (!newCaseBO.trim()) return;

    try {
      const newCase = await createCase(newCaseBO.trim(), newCaseNatureza.trim() || undefined);
      selectCase(newCase.id);
      setShowNewCaseModal(false);
      setNewCaseBO('');
      setNewCaseNatureza('');
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error('Erro ao criar caso:', error);
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este caso?')) {
      try {
        await deleteCase(caseId);
      } catch (error) {
        console.error('Erro ao deletar caso:', error);
      }
    }
  };

  const generateBO = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900000) + 100000;
    setNewCaseBO(`${year}/${random}`);
  };

  // Naturezas únicas para o filtro
  const uniqueNaturezas = [...new Set(cases.map((c) => c.natureza).filter((n) => n))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-4">Casos</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por BO, endereço..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todos os Status</option>
            <option value="rascunho">Em rascunho</option>
            <option value="em_revisao">Em revisão</option>
            <option value="finalizado">Finalizado</option>
          </select>

          <select
            value={naturezaFilter}
            onChange={(e) => setNaturezaFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todas as Naturezas</option>
            {uniqueNaturezas.map((natureza) => (
              <option key={natureza} value={natureza}>
                {natureza}
              </option>
            ))}
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            Período
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Mais Filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs text-gray-600 px-4 py-3">BO</th>
                  <th className="text-left text-xs text-gray-600 px-4 py-3">Natureza</th>
                  <th className="text-left text-xs text-gray-600 px-4 py-3 hidden md:table-cell">Data/Hora</th>
                  <th className="text-left text-xs text-gray-600 px-4 py-3 hidden lg:table-cell">Endereço</th>
                  <th className="text-left text-xs text-gray-600 px-4 py-3">Status</th>
                  <th className="text-left text-xs text-gray-600 px-4 py-3 hidden xl:table-cell">Última Atualização</th>
                  <th className="text-left text-xs text-gray-600 px-4 py-3">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caso) => (
                  <tr key={caso.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">BO {caso.bo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{caso.natureza || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {formatDate(caso.dataHoraFato)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">
                      {caso.endereco || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(
                          caso.status
                        )}`}
                      >
                        {getStatusLabel(caso.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden xl:table-cell">
                      {getRelativeTime(caso.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenCase(caso.id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Abrir
                        </button>
                        <button
                          onClick={() => handleDeleteCase(caso.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredCases.length === 0 && (
              <div className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm text-gray-600 mb-1">Nenhum caso encontrado</h3>
                <p className="text-xs text-gray-500">Ajuste os filtros ou crie um novo caso</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Shortcuts */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm mb-3">Atalhos</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowNewCaseModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                Criar Caso
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                <Upload className="w-4 h-4 text-blue-600" />
                Importar Fotos
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                <Package className="w-4 h-4 text-blue-600" />
                Gerar Pacote
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
            <h3 className="text-sm mb-3">Estatísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de casos</span>
                <span className="font-medium">{cases.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Em rascunho</span>
                <span className="font-medium text-yellow-600">
                  {cases.filter((c) => c.status === 'rascunho').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Em revisão</span>
                <span className="font-medium text-blue-600">
                  {cases.filter((c) => c.status === 'em_revisao').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Finalizados</span>
                <span className="font-medium text-green-600">
                  {cases.filter((c) => c.status === 'finalizado').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Novo Caso */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowNewCaseModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-medium mb-4">Criar Novo Caso</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Boletim de Ocorrência (BO) *</label>
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
    </div>
  );
}
