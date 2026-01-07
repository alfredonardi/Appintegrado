import { Search, Plus, User, Building2, CheckCircle2 } from 'lucide-react';

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar casos, BO, endereço..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Novo Caso */}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
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

        {/* User */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
          <User className="w-4 h-4 text-gray-600" />
          <span className="hidden sm:inline text-sm text-gray-700">Dr. Silva</span>
        </div>
      </div>
    </header>
  );
}
