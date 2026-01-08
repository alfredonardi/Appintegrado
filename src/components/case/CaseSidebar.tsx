/**
 * CaseSidebar.tsx - Sidebar dinâmica para submódulos de caso (ETAPA 9)
 *
 * Este componente renderiza o menu de submódulos do caso dinamicamente
 * com base nas feature flags ativadas em caseModules.ts
 *
 * Integrado em CaseLayout ou usado diretamente nas páginas de caso.
 */

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Camera,
  Eye,
  Image,
  FileSearch,
  Package,
  ChevronRight,
} from 'lucide-react';
import { CASE_MODULES, getActiveModules } from '../../config/caseModules';

/**
 * Map de ícones por módulo
 */
const ICON_MAP: Record<string, React.ComponentType<{ className: string }>> = {
  camera: Camera,
  eye: Eye,
  image: Image,
  'file-search': FileSearch,
  package: Package,
};

/**
 * CaseSidebar - Componente de sidebar para módulos de caso
 */
export function CaseSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { caseId } = useParams<{ caseId: string }>();

  // Obter apenas módulos ativos
  const activeModules = getActiveModules();

  // Se não houver módulos ativos, não renderizar
  if (activeModules.length === 0) {
    return null;
  }

  // Determinar qual módulo está atualmente ativo
  const isModuleActive = (modulePath: string): boolean => {
    return location.pathname === `/cases/${caseId}/${modulePath}`;
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 hidden lg:block">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Submódulos</h3>
        <p className="text-xs text-gray-500 mt-1">BO {caseId}</p>
      </div>

      {/* Menu Items */}
      <nav className="p-2">
        {activeModules.map((module) => {
          const IconComponent = ICON_MAP[module.icon] || ChevronRight;
          const isActive = isModuleActive(module.path);

          return (
            <button
              key={module.id}
              onClick={() => navigate(`/cases/${caseId}/${module.path}`)}
              className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={module.description}
            >
              <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="text-left flex-1">
                <p className="text-sm font-medium">{module.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{module.description}</p>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />}
            </button>
          );
        })}
      </nav>

      {/* Footer - Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          {activeModules.length} módulo{activeModules.length > 1 ? 's' : ''} ativo{activeModules.length > 1 ? 's' : ''}
        </p>
      </div>
    </aside>
  );
}

/**
 * CaseSidebarMobile - Versão mobile do CaseSidebar (compacta)
 * Usa um dropdown ou accordion para economizar espaço
 */
export function CaseSidebarMobile() {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();
  const activeModules = getActiveModules();

  if (activeModules.length === 0) {
    return null;
  }

  return (
    <div className="lg:hidden px-4 py-3 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span>Submódulos:</span>
        <span className="font-medium text-gray-900">{activeModules.length} ativo{activeModules.length > 1 ? 's' : ''}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeModules.map((module) => (
          <button
            key={module.id}
            onClick={() => navigate(`/cases/${caseId}/${module.path}`)}
            className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {module.label}
          </button>
        ))}
      </div>
    </div>
  );
}
