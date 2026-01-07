import { ChevronRight, Edit2, Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface CaseWorkspaceScreenProps {
  onNavigate: (screen: string) => void;
}

export function CaseWorkspaceScreen({ onNavigate }: CaseWorkspaceScreenProps) {
  const reports = [
    { name: 'Reconhecimento Visuográfico', status: 'Em andamento', progress: 65, screen: 'recognition' },
    { name: 'Relatório Fotográfico', status: 'Não iniciado', progress: 0, screen: 'photo-report' },
    { name: 'Relatório de Investigação', status: 'Não iniciado', progress: 0, screen: 'investigation-report' },
  ];

  const team = [
    { role: 'Delegado', name: 'Dr. Carlos Silva' },
    { role: 'Escrivão', name: 'Ana Santos' },
    { role: 'Investigador', name: 'João Pereira' },
    { role: 'Fotógrafo', name: 'Pedro Costa' },
  ];

  const events = [
    { type: 'Acionamento', time: '05/01/2025 14:30' },
    { type: 'Chegada no local', time: '05/01/2025 14:45' },
    { type: 'Liberação da cena', time: '05/01/2025 17:20' },
    { type: 'Término', time: '05/01/2025 18:00' },
  ];

  const alerts = [
    { type: 'warning', text: 'Faltam fotos de acesso principal' },
    { type: 'warning', text: 'Campo "Iluminação" com baixa confiança (52%)' },
    { type: 'error', text: 'Data/hora de chegada divergente entre campos' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <span>Casos</span>
        <ChevronRight className="w-4 h-4" />
        <span>BO 2025/123456</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">Visão Geral</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-1">BO 2025/123456 - Homicídio</h1>
        <p className="text-sm text-gray-600">Criado em 05/01/2025 às 14:30</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm">Dados Principais do Caso</h2>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Boletim de Ocorrência</label>
                <p className="text-sm text-gray-900">BO 2025/123456</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Natureza</label>
                <p className="text-sm text-gray-900">Homicídio</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Data/Hora do Fato</label>
                <p className="text-sm text-gray-900">05/01/2025 às 14:30</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Endereço</label>
                <p className="text-sm text-gray-900">Rua das Flores, 123 - Centro, SP</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Circunscrição</label>
                <p className="text-sm text-gray-900">1º DP - Centro</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Unidade</label>
                <p className="text-sm text-gray-900">DPC - São Paulo</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm">Equipe</h2>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {team.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
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
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm">Eventos de Campo</h2>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                <Edit2 className="w-4 h-4" />
                Adicionar Evento
              </button>
            </div>
            <div className="space-y-3">
              {events.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                    {index < events.length - 1 && <div className="w-0.5 h-8 bg-gray-300" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{event.type}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Reports Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm mb-4">Progresso dos Relatórios</h2>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900">{report.name}</p>
                    <span className="text-xs text-gray-500">{report.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${report.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs ${
                        report.status === 'Em andamento' ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {report.status}
                    </span>
                    <button
                      onClick={() => onNavigate(report.screen)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Continuar
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm mb-4">IA: Alertas e Lacunas</h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex gap-2 p-3 rounded ${
                    alert.type === 'warning' ? 'bg-yellow-50' : 'bg-red-50'
                  }`}
                >
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs text-gray-700">{alert.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
