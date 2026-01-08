import { 
  Folder, 
  Camera, 
  FileText, 
  Image, 
  FileSearch, 
  Package, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentScreen, onNavigate, isCollapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    { id: 'cases', label: 'Casos', icon: Folder },
    { id: 'capture', label: 'Captura & IA', icon: Camera },
    { id: 'recognition', label: 'Reconhecimento', icon: FileText },
    { id: 'photo-report', label: 'Relatório Fotográfico', icon: Image },
    { id: 'investigation-report', label: 'Relatório de Investigação', icon: FileSearch },
    { id: 'export', label: 'Exportar Pacote', icon: Package },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-gray-900 text-white flex flex-col transition-all duration-300 relative`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <h1 className={`text-xl ${isCollapsed ? 'hidden' : 'block'}`}>
          <span className="font-semibold">Case</span>
          <span className="text-blue-500">Hub</span>
        </h1>
        {isCollapsed && <span className="text-blue-500 font-bold text-xl">CH</span>}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 bg-gray-900 border border-gray-700 rounded-full p-1 hover:bg-gray-800 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-800 ${isCollapsed ? 'text-center' : ''}`}>
        <p className={`text-xs text-gray-500 ${isCollapsed ? 'hidden' : 'block'}`}>
          v1.0.0
        </p>
      </div>
    </aside>
  );
}
