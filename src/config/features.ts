/**
 * Feature Flags - Configuração central de features
 *
 * Use variáveis de ambiente para override:
 * VITE_FEATURE_CLIENTS=true
 * VITE_FEATURE_REPORTS=false
 * etc.
 */

/**
 * Tipos de features
 */
export type FeatureFlagKey =
  | 'auth'
  | 'dashboard'
  | 'casesModule'
  | 'captureModule'
  | 'recognitionModule'
  | 'photoReportModule'
  | 'investigationModule'
  | 'exportModule'
  | 'clientsModule'
  | 'reportsModule'
  | 'settingsModule'
  | 'analyticsModule';

/**
 * Interface para feature flag
 */
export interface FeatureFlag {
  key: FeatureFlagKey;
  name: string;
  description: string;
  enabled: boolean;
}

/**
 * Configuração de features
 * Valores padrão para desenvolvimento
 */
const DEFAULT_FEATURES: Record<FeatureFlagKey, boolean> = {
  // Core features (sempre ativo)
  auth: true,

  // Módulos principais
  dashboard: true,
  casesModule: true,

  // Submódulos de Casos (ETAPA 8 - Feature Flags)
  captureModule: true,
  recognitionModule: true,
  photoReportModule: true,
  investigationModule: true,
  exportModule: true,

  // Módulos opcionais
  clientsModule: true, // Ativado em ETAPA 7
  reportsModule: false,
  settingsModule: true,
  analyticsModule: false,
};

/**
 * Função para obter valor de feature flag
 * Prioridade: Variável de ambiente > Default
 */
function getFeatureValue(key: FeatureFlagKey): boolean {
  // Tentar obter do .env (VITE_FEATURE_<KEY>=true/false)
  const envKey = `VITE_FEATURE_${key.toUpperCase()}`;
  const envValue = import.meta.env[envKey];

  if (envValue !== undefined) {
    return envValue === 'true';
  }

  // Usar valor padrão
  return DEFAULT_FEATURES[key];
}

/**
 * Feature Flags Objeto
 * Acesso: FEATURE_FLAGS.clientsModule
 */
export const FEATURE_FLAGS: Record<FeatureFlagKey, boolean> = {
  auth: getFeatureValue('auth'),
  dashboard: getFeatureValue('dashboard'),
  casesModule: getFeatureValue('casesModule'),
  captureModule: getFeatureValue('captureModule'),
  recognitionModule: getFeatureValue('recognitionModule'),
  photoReportModule: getFeatureValue('photoReportModule'),
  investigationModule: getFeatureValue('investigationModule'),
  exportModule: getFeatureValue('exportModule'),
  clientsModule: getFeatureValue('clientsModule'),
  reportsModule: getFeatureValue('reportsModule'),
  settingsModule: getFeatureValue('settingsModule'),
  analyticsModule: getFeatureValue('analyticsModule'),
};

/**
 * Lista de todas as features com metadados
 * Útil para admin panels, logs, etc.
 */
export const ALL_FEATURES: FeatureFlag[] = [
  {
    key: 'auth',
    name: 'Autenticação',
    description: 'Sistema de login e autenticação',
    enabled: FEATURE_FLAGS.auth,
  },
  {
    key: 'dashboard',
    name: 'Dashboard',
    description: 'Página inicial e dashboard',
    enabled: FEATURE_FLAGS.dashboard,
  },
  {
    key: 'casesModule',
    name: 'Módulo de Casos',
    description: 'Gerenciamento de casos de investigação',
    enabled: FEATURE_FLAGS.casesModule,
  },
  {
    key: 'captureModule',
    name: 'Captura & IA',
    description: 'Submódulo de captura de fotos e classificação por IA',
    enabled: FEATURE_FLAGS.captureModule,
  },
  {
    key: 'recognitionModule',
    name: 'Reconhecimento',
    description: 'Submódulo de reconhecimento visuográfico',
    enabled: FEATURE_FLAGS.recognitionModule,
  },
  {
    key: 'photoReportModule',
    name: 'Relatório Fotográfico',
    description: 'Submódulo de geração de relatório fotográfico',
    enabled: FEATURE_FLAGS.photoReportModule,
  },
  {
    key: 'investigationModule',
    name: 'Investigação',
    description: 'Submódulo de relatório de investigação',
    enabled: FEATURE_FLAGS.investigationModule,
  },
  {
    key: 'exportModule',
    name: 'Exportar Pacote',
    description: 'Submódulo de exportação e geração de PDFs',
    enabled: FEATURE_FLAGS.exportModule,
  },
  {
    key: 'clientsModule',
    name: 'Módulo de Clientes',
    description: 'Gerenciamento de clientes (CRUD)',
    enabled: FEATURE_FLAGS.clientsModule,
  },
  {
    key: 'reportsModule',
    name: 'Módulo de Relatórios',
    description: 'Geração e visualização de relatórios',
    enabled: FEATURE_FLAGS.reportsModule,
  },
  {
    key: 'settingsModule',
    name: 'Configurações',
    description: 'Página de configurações do usuário',
    enabled: FEATURE_FLAGS.settingsModule,
  },
  {
    key: 'analyticsModule',
    name: 'Analytics',
    description: 'Estatísticas e analytics',
    enabled: FEATURE_FLAGS.analyticsModule,
  },
];

/**
 * Função helper: isFeatureEnabled
 * Mais explícita que acessar FEATURE_FLAGS[key] diretamente
 */
export function isFeatureEnabled(featureKey: FeatureFlagKey): boolean {
  return FEATURE_FLAGS[featureKey];
}

/**
 * Função helper: getEnabledFeatures
 * Retorna lista de features ativadas
 */
export function getEnabledFeatures(): FeatureFlagKey[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key as FeatureFlagKey);
}

/**
 * Log de features ativadas (desenvolvimento)
 */
if (import.meta.env.DEV) {
  console.log('🚩 Feature Flags:', FEATURE_FLAGS);
}
