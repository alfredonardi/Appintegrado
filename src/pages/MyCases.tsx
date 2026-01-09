/**
 * Tela: Meus Casos
 *
 * Exibe apenas os casos da equipe do usuário logado.
 * - Investigadores: casos do seu time
 * - Chefes/Delegados: casos do seu time + casos compartilhados da organização
 *
 * Features:
 * - Toggle "Compartilhar com chefia" (só para membros do caso)
 * - Filtros por status
 * - Busca por BO, endereço
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Share2, Lock, Eye, Trash2, FileText, Filter } from 'lucide-react';
import { useCasesStore } from '../state';
import { useAuth } from '../state/auth';
import { casesService } from '../services/casesService';
import { casesServiceNhost } from '../services/nhost/casesServiceNhost';
import { isNhostProvider } from '../services/provider';
import { CaseStatus } from '../types';

export function MyCases() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cases, loading, selectCase } = useCasesStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showingSharedOnly, setShowingSharedOnly] = useState(false);
  const [sharingCaseId, setSharingCaseId] = useState<string | null>(null);
  const [loadingShare, setLoadingShare] = useState(false);

  // Filtrar casos do usuário
  const myCases = cases.filter((caso) => {
    // Em mock mode: mostrar todos
    // Em Nhost: filtrará automaticamente via RLS
    if (!isNhostProvider()) {
      return true; // Mock mostra todos
    }
    // Nhost já filtra na API
    return true;
  });

  // Aplicar filtros adicionais
  const filteredCases = myCases.filter((caso) => {
    // Filtro de busca
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      caso.bo.toLowerCase().includes(searchLower) ||
      caso.natureza.toLowerCase().includes(searchLower) ||
      caso.endereco.toLowerCase().includes(searchLower);

    // Filtro de status
    const matchesStatus = statusFilter === 'all' || caso.status === statusFilter;

    // Filtro de compartilhados
    const matchesShared = !showingSharedOnly || caso.shared_with_org === true;

    return matchesSearch && matchesStatus && matchesShared;
  });

  // Funções auxiliares
  const getStatusLabel = (status: CaseStatus) => {
    const labels: Record<CaseStatus, string> = {
      rascunho: 'Em rascunho',
      em_revisao: 'Em revisão',
      finalizado: 'Finalizado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: CaseStatus) => {
    const colors: Record<CaseStatus, string> = {
      rascunho: 'bg-yellow-100 text-yellow-800',
      em_revisao: 'bg-blue-100 text-blue-800',
      finalizado: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return (
      date.toLocaleDateString('pt-BR') +
      ' ' +
      date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    );
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

  // Compartilhar/descompartilhar caso
  const handleToggleShare = async (caseId: string, currentSharedState: boolean) => {
    setSharingCaseId(caseId);
    setLoadingShare(true);

    try {
      const newSharedState = !currentSharedState;

      if (isNhostProvider()) {
        // Nhost: usar GraphQL mutation
        await casesServiceNhost.shareCaseWithOrg(caseId, newSharedState);
      } else {
        // Mock: atualizar localmente
        await casesService.updateCase(caseId, {
          shared_with_org: newSharedState,
        });
      }

      // Recarregar casos
      // Nota: Em produção, poderia usar cache invalidation
      window.location.reload();
    } catch (error) {
      console.error('Erro ao compartilhar caso:', error);
      alert('Erro ao compartilhar caso. Tente novamente.');
    } finally {
      setSharingCaseId(null);
      setLoadingShare(false);
    }
  };

  const handleOpenCase = (caseId: string) => {
    selectCase(caseId);
    navigate(`/cases/${caseId}`);
  };

  const handleDeleteCase = async (caseId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este caso?')) {
      try {
        await casesService.deleteCase(caseId);
        window.location.reload();
      } catch (error) {
        console.error('Erro ao deletar caso:', error);
      }
    }
  };

  // Renderização
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Meus Casos</h1>
        {user && (
          <p className="text-sm text-gray-600">
            Equipe: <span className="font-medium">{user.organization_id || 'N/A'}</span>
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
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

        <button
          onClick={() => setShowingSharedOnly(!showingSharedOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
            showingSharedOnly
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Share2 className="w-4 h-4" />
          {showingSharedOnly ? 'Compartilhados' : 'Todos'}
        </button>

        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Mais Filtros
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600">Carregando seus casos...</p>
        </div>
      )}

      {/* Cases Table */}
      {!loading && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs text-gray-600 px-4 py-3">BO</th>
                <th className="text-left text-xs text-gray-600 px-4 py-3">Natureza</th>
                <th className="text-left text-xs text-gray-600 px-4 py-3 hidden md:table-cell">
                  Data/Hora
                </th>
                <th className="text-left text-xs text-gray-600 px-4 py-3 hidden lg:table-cell">
                  Endereço
                </th>
                <th className="text-left text-xs text-gray-600 px-4 py-3">Status</th>
                <th className="text-center text-xs text-gray-600 px-4 py-3">Compartilhado</th>
                <th className="text-left text-xs text-gray-600 px-4 py-3 hidden xl:table-cell">
                  Última Atualização
                </th>
                <th className="text-left text-xs text-gray-600 px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((caso) => (
                <tr
                  key={caso.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
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

                  {/* Compartilhamento */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleShare(caso.id, caso.shared_with_org || false)}
                      disabled={loadingShare && sharingCaseId === caso.id}
                      className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                        caso.shared_with_org
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      } ${loadingShare && sharingCaseId === caso.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={
                        caso.shared_with_org
                          ? 'Caso compartilhado com a chefia'
                          : 'Compartilhar com a chefia'
                      }
                    >
                      {loadingShare && sharingCaseId === caso.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : caso.shared_with_org ? (
                        <Share2 className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-500 hidden xl:table-cell">
                    {getRelativeTime(caso.updatedAt)}
                  </td>

                  {/* Ações */}
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
              <h3 className="text-sm text-gray-600 mb-1">
                {showingSharedOnly ? 'Nenhum caso compartilhado' : 'Nenhum caso encontrado'}
              </h3>
              <p className="text-xs text-gray-500">
                {showingSharedOnly
                  ? 'Você não tem casos compartilhados com a chefia ainda'
                  : 'Ajuste os filtros ou crie um novo caso'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Dica: Compartilhar com Chefia</h3>
        <p className="text-sm text-blue-800">
          Clique no ícone de cadeado/compartilhamento para compartilhar este caso com a chefia de sua
          delegacia. Casos compartilhados aparecem na visão de chefes/delegados.
        </p>
      </div>
    </div>
  );
}
