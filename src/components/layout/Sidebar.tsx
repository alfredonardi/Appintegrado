import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  Folder,
  Camera,
  FileText,
  Image,
  FileSearch,
  Package,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FEATURE_FLAGS } from '../../config/features';

/**
 * Sidebar - Menu lateral com navegação
 * Usa React Router para navegação e detecção de rota ativa
 * Menu items condicionados por feature flags
 */
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const caseId = params.caseId;

  // Definir menu items
  // Para rotas que precisam de caseId, não mostrar se não houver caso selecionado
  // Adicionar feature flags para mostrar/esconder itens
  const menuItems = [
    // Casos (condicionado por FEATURE_FLAGS.casesModule)
    {
      id: 'cases',
      label: 'Casos',
      icon: Folder,
      path: '/cases',
      featureFlag: 'casesModule' as const,
    },
    {
      id: 'capture',
      label: 'Captura & IA',
      icon: Camera,
      path: caseId ? `/cases/${caseId}/capture` : null,
      featureFlag: 'casesModule' as const,
    },
    {
      id: 'recognition',
      label: 'Reconhecimento',
      icon: FileText,
      path: caseId ? `/cases/${caseId}/recognition` : null,
      featureFlag: 'casesModule' as const,
    },
    {
      id: 'photo-report',
      label: 'Relatório Fotográfico',
      icon: Image,
      path: caseId ? `/cases/${caseId}/photo-report` : null,
      featureFlag: 'casesModule' as const,
    },
    {
      id: 'investigation-report',
      label: 'Relatório de Investigação',
      icon: FileSearch,
      path: caseId ? `/cases/${caseId}/investigation` : null,
      featureFlag: 'casesModule' as const,
    },
    {
      id: 'export',
      label: 'Exportar Pacote',
      icon: Package,
      path: caseId ? `/cases/${caseId}/export` : null,
      featureFlag: 'casesModule' as const,
    },
    // Clientes (condicionado por FEATURE_FLAGS.clientsModule - ETAPA 7)
    {
      id: 'clients',
      label: 'Clientes',
      icon: Users,
      path: '/clients',
      featureFlag: 'clientsModule' as const,
    },
    // Configurações
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      path: '/settings',
      featureFlag: 'settingsModule' as const,
    },
  ];

  // Determinar se a rota está ativa
  const isActive = (path: string | null): boolean => {
    if (!path) return false;
    return location.pathname === path;
  };

  const handleNavigate = (path: string | null) => {
    if (!path) return;
    navigate(path);
  };

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
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-gray-900 border border-gray-700 rounded-full p-1 hover:bg-gray-800 transition-colors"
        title={isCollapsed ? 'Expandir' : 'Recolher'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          // Pular itens sem path (caso não selecionado)
          if (!item.path) return null;

          // Pular itens se feature desativada
          if (!FEATURE_FLAGS[item.featureFlag]) return null;

          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                active
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
