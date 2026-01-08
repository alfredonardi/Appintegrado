import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Edit2, Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, Info, Save } from 'lucide-react';
import { useCaseStore, useSelectedCase } from '../state';



export function CaseWorkspaceScreen() {
  const selectedCase = useSelectedCase();
  const {
    calculateRecognitionProgress,
    calculatePhotoReportProgress,
    calculateInvestigationProgress,
    getAlerts,
    updateCase,
  } = useCaseStore();

  const navigate = useNavigate();
  const [isEditingCase, setIsEditingCase] = useState(false);
  const [editForm, setEditForm] = useState({
    bo: '',
    natureza: '',
    dataHoraFato: '',
    endereco: '',
    circunscricao: '',
    unidade: '',
  });

  if (!selectedCase) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-lg text-gray-600 mb-2">Nenhum caso selecionado</h2>
          <p className="text-sm text-gray-500 mb-4">Selecione um caso na lista ou crie um novo.</p>
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

  // Cálculo de progresso real
  const recognitionProgress = calculateRecognitionProgress();
  const photoReportProgress = calculatePhotoReportProgress();
  const investigationProgress = calculateInvestigationProgress();
  const alerts = getAlerts();

  const reports = [
    {
      name: 'Reconhecimento Visuográfico',
      status: recognitionProgress === 0 ? 'Não iniciado' : recognitionProgress === 100 ? 'Completo' : 'Em andamento',
      progress: recognitionProgress,
      screen: 'recognition',
    },
    {
      name: 'Relatório Fotográfico',
      status: photoReportProgress === 0 ? 'Não iniciado' : photoReportProgress === 100 ? 'Completo' : 'Em andamento',
      progress: photoReportProgress,
      screen: 'photo-report',
    },
    {
      name: 'Relatório de Investigação',
      status: investigationProgress === 0 ? 'Não iniciado' : investigationProgress === 100 ? 'Completo' : 'Em andamento',
      progress: investigationProgress,
      screen: 'investigation-report',
    },
  ];

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateShort = (isoDate: string) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleEditCase = () => {
    setEditForm({
      bo: selectedCase.bo,
      natureza: selectedCase.natureza,
      dataHoraFato: selectedCase.dataHoraFato.slice(0, 16),
      endereco: selectedCase.endereco,
      circunscricao: selectedCase.circunscricao,
      unidade: selectedCase.unidade,
    });
    setIsEditingCase(true);
  };

  const handleSaveCase = () => {
    updateCase(selectedCase.id, {
      bo: editForm.bo,
      natureza: editForm.natureza,
      dataHoraFato: editForm.dataHoraFato ? new Date(editForm.dataHoraFato).toISOString() : selectedCase.dataHoraFato,
      endereco: editForm.endereco,
      circunscricao: editForm.circunscricao,
      unidade: editForm.unidade,
    });
    setIsEditingCase(false);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button onClick={() => onNavigate('cases')} className="hover:text-blue-600">
          Casos
        </button>
        <ChevronRight className="w-4 h-4" />
        <span>BO {selectedCase.bo}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">Visão Geral</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-1">
          BO {selectedCase.bo} {selectedCase.natureza && `- ${selectedCase.natureza}`}
        </h1>
        <p className="text-sm text-gray-600">Criado em {formatDate(selectedCase.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Dados Principais do Caso</h2>
              {!isEditingCase ? (
                <button
                  onClick={handleEditCase}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              ) : (
                <button
                  onClick={handleSaveCase}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              )}
            </div>

            {!isEditingCase ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Boletim de Ocorrência</label>
                  <p className="text-sm text-gray-900">BO {selectedCase.bo}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Natureza</label>
                  <p className="text-sm text-gray-900">{selectedCase.natureza || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Data/Hora do Fato</label>
                  <p className="text-sm text-gray-900">{formatDateShort(selectedCase.dataHoraFato)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Endereço</label>
                  <p className="text-sm text-gray-900">{selectedCase.endereco || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Circunscrição</label>
                  <p className="text-sm text-gray-900">{selectedCase.circunscricao || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Unidade</label>
                  <p className="text-sm text-gray-900">{selectedCase.unidade || '-'}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Boletim de Ocorrência</label>
                  <input
                    type="text"
                    value={editForm.bo}
                    onChange={(e) => setEditForm({ ...editForm, bo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Natureza</label>
                  <select
                    value={editForm.natureza}
                    onChange={(e) => setEditForm({ ...editForm, natureza: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Data/Hora do Fato</label>
                  <input
                    type="datetime-local"
                    value={editForm.dataHoraFato}
                    onChange={(e) => setEditForm({ ...editForm, dataHoraFato: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Endereço</label>
                  <input
                    type="text"
                    value={editForm.endereco}
                    onChange={(e) => setEditForm({ ...editForm, endereco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Circunscrição</label>
                  <input
                    type="text"
                    value={editForm.circunscricao}
                    onChange={(e) => setEditForm({ ...editForm, circunscricao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Unidade</label>
                  <input
                    type="text"
                    value={editForm.unidade}
                    onChange={(e) => setEditForm({ ...editForm, unidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Team */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Equipe</h2>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            </div>

            {selectedCase.team.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCase.team.map((member, index) => (
                  <div key={member.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{member.role}</p>
                      <p className="text-sm text-gray-900">{member.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum membro adicionado</p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Eventos de Campo</h2>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                <Edit2 className="w-4 h-4" />
                Adicionar Evento
              </button>
            </div>

            {selectedCase.events.length > 0 ? (
              <div className="space-y-3">
                {selectedCase.events.map((event, index) => (
                  <div key={event.id || index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                      {index < selectedCase.events.length - 1 && <div className="w-0.5 h-8 bg-gray-300" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{event.label}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDateShort(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum evento registrado</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{selectedCase.photos.length}</p>
              <p className="text-xs text-gray-500">Fotos</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {selectedCase.fieldValues.filter((f) => f.status === 'confirmed').length}
              </p>
              <p className="text-xs text-gray-500">Campos Confirmados</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{selectedCase.aiExtractions.filter((e) => e.status === 'pending').length}</p>
              <p className="text-xs text-gray-500">Sugestões IA</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Reports Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-medium mb-4">Progresso dos Relatórios</h2>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900">{report.name}</p>
                    <span className="text-xs text-gray-500">{report.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        report.progress === 100
                          ? 'bg-green-600'
                          : report.progress > 0
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}
                      style={{ width: `${report.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs ${
                        report.status === 'Em andamento'
                          ? 'text-blue-600'
                          : report.status === 'Completo'
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {report.status}
                    </span>
                    <button
                      onClick={() => onNavigate(report.screen)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {report.progress === 0 ? 'Iniciar' : 'Continuar'}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-medium mb-4">IA: Alertas e Lacunas</h2>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className={`flex gap-2 p-3 rounded ${getAlertBg(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                    <p className="text-xs text-gray-700">{alert.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 p-3 rounded bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-700">Nenhum alerta no momento</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-medium mb-4">Ações Rápidas</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/cases/${caseId}/capture`)}
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Importar mais fotos
              </button>
              <button
                onClick={() => navigate(`/cases/${caseId}/recognition`)}
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Confirmar sugestões IA
              </button>
              <button
                onClick={() => navigate(`/cases/${caseId}/export`)}
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Exportar pacote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
