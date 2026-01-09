/**
 * Página de Edição de Caso (ETAPA 8)
 * Permite editar informações básicas do caso usando React Hook Form
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCasesStore } from '@/state/casesStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { CaseStatus } from '@/types/case';

interface EditCaseFormData {
  bo: string;
  natureza: string;
  endereco: string;
  cep: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  circunscricao: string;
  unidade: string;
  status: CaseStatus;
}

export function CasesEdit() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { getCaseById, updateCase, loading } = useCasesStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditCaseFormData>({
    defaultValues: {
      bo: '',
      natureza: '',
      endereco: '',
      cep: '',
      bairro: '',
      cidade: '',
      estado: '',
      circunscricao: '',
      unidade: '',
      status: 'rascunho',
    },
  });

  useEffect(() => {
    if (caseId) {
      const caseItem = getCaseById(caseId);
      if (caseItem) {
        reset({
          bo: caseItem.bo,
          natureza: caseItem.natureza,
          endereco: caseItem.endereco,
          cep: caseItem.cep,
          bairro: caseItem.bairro || '',
          cidade: caseItem.cidade || '',
          estado: caseItem.estado || '',
          circunscricao: caseItem.circunscricao,
          unidade: caseItem.unidade,
          status: caseItem.status,
        });
      }
    }
  }, [caseId, getCaseById, reset]);

  const onSubmit = async (data: EditCaseFormData) => {
    if (!caseId) {
      return;
    }

    try {
      await updateCase(caseId, data);
      navigate(`/cases`);
    } catch (error) {
      console.error('Erro ao atualizar caso:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/cases')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Caso</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : !caseId ? (
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-800">Caso não encontrado</p>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Boletim de Ocorrência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Boletim de Ocorrência (BO)
                </label>
                <Input
                  type="text"
                  disabled
                  {...register('bo')}
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600`}
                >
                  <option value="rascunho">Em rascunho</option>
                  <option value="em_revisao">Em revisão</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              {/* Natureza */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Natureza
                </label>
                <select
                  {...register('natureza')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
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

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endereço
                </label>
                <Input
                  type="text"
                  placeholder="Rua, número, complemento"
                  {...register('endereco')}
                />
              </div>

              {/* Localização - Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CEP
                  </label>
                  <Input
                    type="text"
                    placeholder="00000-000"
                    {...register('cep')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bairro
                  </label>
                  <Input
                    type="text"
                    placeholder="Bairro"
                    {...register('bairro')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cidade
                  </label>
                  <Input
                    type="text"
                    placeholder="Cidade"
                    {...register('cidade')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <Input
                    type="text"
                    placeholder="SP"
                    maxLength={2}
                    {...register('estado')}
                  />
                </div>
              </div>

              {/* Jurisdição */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Circunscrição
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: 1ª Circunscrição"
                    {...register('circunscricao', { required: 'Circunscrição é obrigatória' })}
                    className={errors.circunscricao ? 'border-red-500' : ''}
                  />
                  {errors.circunscricao && (
                    <p className="text-red-600 text-sm mt-1">{errors.circunscricao.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unidade
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: DHPP"
                    {...register('unidade', { required: 'Unidade é obrigatória' })}
                    className={errors.unidade ? 'border-red-500' : ''}
                  />
                  {errors.unidade && (
                    <p className="text-red-600 text-sm mt-1">{errors.unidade.message}</p>
                  )}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/cases')}
                  className="flex-1"
                  disabled={isSubmitting || loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  disabled={isSubmitting || loading}
                >
                  <Save size={18} />
                  {isSubmitting || loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
