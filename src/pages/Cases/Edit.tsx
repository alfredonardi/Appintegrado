/**
 * Página de Edição de Caso (ETAPA 8)
 * Permite editar informações básicas do caso
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCasesStore } from '@/state/casesStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { CaseStatus } from '@/types/case';

export function CasesEdit() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { getCaseById, updateCase, loading } = useCasesStore();

  const [formData, setFormData] = useState({
    bo: '',
    natureza: '',
    endereco: '',
    cep: '',
    bairro: '',
    cidade: '',
    estado: '',
    circunscricao: '',
    unidade: '',
    status: 'rascunho' as CaseStatus,
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (caseId) {
      const caseItem = getCaseById(caseId);
      if (caseItem) {
        setFormData({
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
      } else {
        setError('Caso não encontrado');
      }
    }
  }, [caseId, getCaseById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bo.trim()) {
      setError('BO é obrigatório');
      return;
    }

    if (!caseId) {
      setError('ID do caso não encontrado');
      return;
    }

    setSaving(true);
    try {
      await updateCase(caseId, formData);
      navigate(`/cases/${caseId}`);
    } catch (err) {
      setError('Erro ao atualizar caso');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Caso</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : error ? (
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-800">{error}</p>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Boletim de Ocorrência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Boletim de Ocorrência (BO) *
                </label>
                <Input
                  type="text"
                  name="bo"
                  value={formData.bo}
                  onChange={handleChange}
                  placeholder="Ex: 2025/123456"
                  required
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
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
                  name="natureza"
                  value={formData.natureza}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
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
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Rua, número, complemento"
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
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bairro
                  </label>
                  <Input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cidade
                  </label>
                  <Input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <Input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    placeholder="SP"
                    maxLength={2}
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
                    name="circunscricao"
                    value={formData.circunscricao}
                    onChange={handleChange}
                    placeholder="Ex: 1ª Circunscrição"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unidade
                  </label>
                  <Input
                    type="text"
                    name="unidade"
                    value={formData.unidade}
                    onChange={handleChange}
                    placeholder="Ex: DHPP"
                  />
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving || loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Save size={18} />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
