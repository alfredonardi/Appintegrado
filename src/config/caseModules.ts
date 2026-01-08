/**
 * Configuração dos submódulos de caso (ETAPA 9)
 *
 * Define a lista de submódulos disponíveis, seus metadados,
 * feature flags associadas e helpers para navegação inteligente.
 */

import { isFeatureEnabled } from './features';
import type { FeatureFlagKey } from './features';

/**
 * Tipo para módulo de caso
 */
export interface CaseModule {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: string; // Nome do ícone (ex: 'camera', 'eye', etc)
  featureFlag: FeatureFlagKey;
  order: number;
}

/**
 * Lista de todos os módulos de caso disponíveis
 * Ordem define a sequência no menu e de redirecionamento
 */
export const CASE_MODULES: CaseModule[] = [
  {
    id: 'capture',
    label: 'Captura & IA',
    description: 'Captura de fotos e classificação por IA',
    path: 'capture',
    icon: 'camera',
    featureFlag: 'captureModule',
    order: 1,
  },
  {
    id: 'recognition',
    label: 'Reconhecimento',
    description: 'Reconhecimento visuográfico',
    path: 'recognition',
    icon: 'eye',
    featureFlag: 'recognitionModule',
    order: 2,
  },
  {
    id: 'photo-report',
    label: 'Relatório Fotográfico',
    description: 'Geração de relatório fotográfico',
    path: 'photo-report',
    icon: 'image',
    featureFlag: 'photoReportModule',
    order: 3,
  },
  {
    id: 'investigation',
    label: 'Relatório de Investigação',
    description: 'Relatório de investigação',
    path: 'investigation',
    icon: 'file-search',
    featureFlag: 'investigationModule',
    order: 4,
  },
  {
    id: 'export',
    label: 'Exportar Pacote',
    description: 'Exportação e geração de PDFs',
    path: 'export',
    icon: 'package',
    featureFlag: 'exportModule',
    order: 5,
  },
];

/**
 * Obter módulos ativos (filtrados por feature flags)
 */
export function getActiveModules(): CaseModule[] {
  return CASE_MODULES.filter((module) => isFeatureEnabled(module.featureFlag)).sort(
    (a, b) => a.order - b.order,
  );
}

/**
 * Obter o primeiro módulo ativo
 * Usado para redirecionamento quando nenhum módulo específico é acessado
 */
export function getFirstActiveModule(): CaseModule | null {
  const activeModules = getActiveModules();
  return activeModules.length > 0 ? activeModules[0] : null;
}

/**
 * Verificar se um módulo está ativo (feature flag ativada)
 */
export function isModuleActive(moduleId: string): boolean {
  const module = CASE_MODULES.find((m) => m.id === moduleId);
  if (!module) return false;
  return isFeatureEnabled(module.featureFlag);
}

/**
 * Obter módulo por ID
 */
export function getModuleById(moduleId: string): CaseModule | undefined {
  return CASE_MODULES.find((m) => m.id === moduleId);
}

/**
 * Obter próximo módulo ativo na sequência
 */
export function getNextActiveModule(currentModuleId: string): CaseModule | null {
  const activeModules = getActiveModules();
  const currentIndex = activeModules.findIndex((m) => m.id === currentModuleId);

  if (currentIndex === -1) {
    return activeModules.length > 0 ? activeModules[0] : null;
  }

  if (currentIndex + 1 < activeModules.length) {
    return activeModules[currentIndex + 1];
  }

  return null;
}

/**
 * Log de módulos ativos (desenvolvimento)
 */
if (import.meta.env.DEV) {
  console.log('📦 Case Modules Config:', {
    allModules: CASE_MODULES,
    activeModules: getActiveModules(),
    firstActive: getFirstActiveModule(),
  });
}
