import { Search, Filter, Calendar, MapPin, FileText, Eye, Plus, Upload, Package } from 'lucide-react';

interface CasesListScreenProps {
  onNavigate: (screen: string) => void;
}

export function CasesListScreen({ onNavigate }: CasesListScreenProps) {
  const cases = [
    { bo: 'BO 2025/123456', nature: 'Homicídio', date: '05/01/2025 14:30', address: 'Rua das Flores, 123 - Centro', status: 'Em rascunho', lastUpdate: 'Há 2 horas' },
    { bo: 'BO 2025/123445', nature: 'Roubo', date: '04/01/2025 09:15', address: 'Av. Paulista, 1578 - Bela Vista', status: 'Em revisão', lastUpdate: 'Há 5 horas' },
    { bo: 'BO 2025/123434', nature: 'Furto Qualificado', date: '03/01/2025 18:45', address: 'Rua Augusta, 2890 - Jardins', status: 'Finalizado', lastUpdate: 'Há 1 dia' },
    { bo: 'BO 2025/123401', nature: 'Tráfico de Drogas', date: '02/01/2025 22:10', address: 'Rua do Comércio, 456 - Brás', status: 'Em rascunho', lastUpdate: 'Há 2 dias' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em rascunho':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em revisão':
        return 'bg-blue-100 text-blue-800';
      case 'Finalizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
              placeholder="Buscar por BO, endereço..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option>Todos os Status</option>
            <option>Em rascunho</option>
            <option>Em revisão</option>
            <option>Finalizado</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option>Todas as Naturezas</option>
            <option>Homicídio</option>
            <option>Roubo</option>
            <option>Furto</option>
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
                {cases.map((caso, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{caso.bo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{caso.nature}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{caso.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{caso.address}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(caso.status)}`}>
                        {caso.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden xl:table-cell">{caso.lastUpdate}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onNavigate('workspace')}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {cases.length === 0 && (
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
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
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
        </div>
      </div>
    </div>
  );
}
