/**
 * Página de Criar Novo Caso
 * Utiliza React Hook Form para validação e gerenciamento de estado
 */

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCasesStore } from '@/state/casesStore';
import { Case } from '@/types/case';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

interface CreateCaseFormData {
  bo: string;
  natureza: string;
  dataHoraFato: string;
  endereco: string;
  cep: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  circunscricao: string;
  unidade: string;
}

export function CasesCreate() {
  const navigate = useNavigate();
  const { createCase, loading } = useCasesStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCaseFormData>({
    defaultValues: {
      bo: '',
      natureza: '',
      dataHoraFato: new Date().toISOString().split('T')[0],
      endereco: '',
      cep: '',
      bairro: '',
      cidade: '',
      estado: '',
      circunscricao: '',
      unidade: '',
    },
  });

  const onSubmit = async (data: CreateCaseFormData) => {
    try {
      await createCase(
        data.bo,
        data.natureza,
        data.endereco,
        data.dataHoraFato
      );
      reset();
      navigate('/cases');
    } catch (error) {
      console.error('Erro ao criar caso:', error);
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Novo Caso</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Criar novo caso de investigação</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Boletim de Ocorrência */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Boletim de Ocorrência (BO) *
              </label>
              <Input
                type="text"
                placeholder="Ex: 2025/123456"
                {...register('bo', {
                  required: 'BO é obrigatório',
                  minLength: { value: 3, message: 'BO deve ter no mínimo 3 caracteres' },
                })}
                className={errors.bo ? 'border-red-500' : ''}
              />
              {errors.bo && <p className="text-red-600 text-sm mt-1">{errors.bo.message}</p>}
            </div>

            {/* Natureza */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Natureza *
              </label>
              <select
                {...register('natureza', { required: 'Natureza é obrigatória' })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
                  errors.natureza ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Selecione uma natureza...</option>
                <option value="Homicídio">Homicídio</option>
                <option value="Roubo">Roubo</option>
                <option value="Furto">Furto</option>
                <option value="Latrocínio">Latrocínio</option>
                <option value="Lesão Corporal">Lesão Corporal</option>
                <option value="Acidente de Trânsito">Acidente de Trânsito</option>
                <option value="Incêndio">Incêndio</option>
                <option value="Outros">Outros</option>
              </select>
              {errors.natureza && <p className="text-red-600 text-sm mt-1">{errors.natureza.message}</p>}
            </div>

            {/* Data e Hora do Fato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data e Hora do Fato *
              </label>
              <Input
                type="datetime-local"
                {...register('dataHoraFato', { required: 'Data e hora são obrigatórias' })}
                className={errors.dataHoraFato ? 'border-red-500' : ''}
              />
              {errors.dataHoraFato && <p className="text-red-600 text-sm mt-1">{errors.dataHoraFato.message}</p>}
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Endereço *
              </label>
              <Input
                type="text"
                placeholder="Rua, número, complemento"
                {...register('endereco', { required: 'Endereço é obrigatório' })}
                className={errors.endereco ? 'border-red-500' : ''}
              />
              {errors.endereco && <p className="text-red-600 text-sm mt-1">{errors.endereco.message}</p>}
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
                  Circunscrição *
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
                  Unidade *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: DHPP"
                  {...register('unidade', { required: 'Unidade é obrigatória' })}
                  className={errors.unidade ? 'border-red-500' : ''}
                />
                {errors.unidade && <p className="text-red-600 text-sm mt-1">{errors.unidade.message}</p>}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/cases')}
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
                {isSubmitting || loading ? 'Criando...' : 'Criar Caso'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
