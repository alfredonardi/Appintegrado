/**
 * Export.tsx - Página de submódulo de Exportação (ETAPA 9)
 *
 * Este arquivo é um placeholder. O conteúdo real da exportação
 * está em /pages/ExportScreen.tsx
 *
 * Este arquivo existe para manter a estrutura organizada de módulos.
 */

import { useParams } from 'react-router-dom';
import { Package } from 'lucide-react';

export function ExportModule() {
  const { caseId } = useParams<{ caseId: string }>();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Exportar Pacote</h1>
        </div>
        <p className="text-gray-600">Caso #{caseId}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-lg font-medium mb-2">Módulo de Exportação</h2>
        <p className="text-gray-600 mb-4">
          Exporte e gere PDFs contendo todo o pacote de evidências e relatórios do caso.
        </p>
        <p className="text-sm text-gray-500">Este é um submódulo configurável via feature flags.</p>
      </div>
    </div>
  );
}
