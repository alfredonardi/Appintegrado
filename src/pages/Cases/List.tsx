/**
 * Página de Lista de Casos (ETAPA 8)
 * Refactor do CasesListScreen para padrão de páginas estruturado
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCasesStore } from '@/state/casesStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Edit, Plus, Calendar, FileText } from 'lucide-react';
import { CaseStatus } from '@/types/case';

export function CasesList() {
  const navigate = useNavigate();
  const { cases, loading, fetchCases, deleteCase, selectCase } = useCasesStore();

  // Carregar casos ao montar
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleEdit = (caseId: string) => {
    selectCase(caseId);
    navigate(`/cases/${caseId}`);
  };

  const handleDelete = async (caseId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este caso?')) {
      try {
        await deleteCase(caseId);
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  const handleCreate = () => {
    navigate('/cases/new');
  };

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
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header com título e botão */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Casos</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Gerenciar casos de investigação e seus respectivos arquivos
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Caso
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Carregando casos...</p>
          </div>
        ) : cases.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nenhum caso cadastrado</p>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Criar Primeiro Caso
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {cases.map((caseItem) => (
              <Card
                key={caseItem.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      BO {caseItem.bo}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="text-gray-600 dark:text-gray-400">
                        Natureza: <span className="font-medium">{caseItem.natureza || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar size={16} />
                        {formatDate(caseItem.dataHoraFato)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Endereço: {caseItem.endereco || '-'}
                      </div>
                    </div>
                    <div className="mt-2 inline-block">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(
                          caseItem.status
                        )}`}
                      >
                        {getStatusLabel(caseItem.status)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEdit(caseItem.id)}
                      variant="outline"
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(caseItem.id)}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
