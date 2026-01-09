// =============================================================================
// Atlas - Constantes de Telas
// =============================================================================

export const SCREENS = {
  CASES: 'cases',
  WORKSPACE: 'workspace',
  CAPTURE: 'capture',
  RECOGNITION: 'recognition',
  PHOTO_REPORT: 'photo-report',
  INVESTIGATION_REPORT: 'investigation-report',
  EXPORT: 'export',
} as const;

export type ScreenType = typeof SCREENS[keyof typeof SCREENS];

// Telas que requerem um caso selecionado
export const CASE_REQUIRED_SCREENS: ScreenType[] = [
  SCREENS.WORKSPACE,
  SCREENS.CAPTURE,
  SCREENS.RECOGNITION,
  SCREENS.PHOTO_REPORT,
  SCREENS.INVESTIGATION_REPORT,
  SCREENS.EXPORT,
];

// Informações de cada tela
export const SCREEN_INFO: Record<ScreenType, { label: string; description: string }> = {
  [SCREENS.CASES]: {
    label: 'Lista de Casos',
    description: 'Visualize e gerencie todos os casos',
  },
  [SCREENS.WORKSPACE]: {
    label: 'Workspace',
    description: 'Visão geral do caso ativo',
  },
  [SCREENS.CAPTURE]: {
    label: 'Captura & IA',
    description: 'Importar fotos e extrair informações com IA',
  },
  [SCREENS.RECOGNITION]: {
    label: 'Reconhecimento Visuográfico',
    description: 'Preencher dados do reconhecimento',
  },
  [SCREENS.PHOTO_REPORT]: {
    label: 'Relatório Fotográfico',
    description: 'Montar relatório com fotos e legendas',
  },
  [SCREENS.INVESTIGATION_REPORT]: {
    label: 'Relatório de Investigação',
    description: 'Elaborar relatório preliminar de investigação',
  },
  [SCREENS.EXPORT]: {
    label: 'Exportar',
    description: 'Gerar pacote com todos os documentos',
  },
};

// Verificar se tela requer caso selecionado
export const screenRequiresCase = (screen: ScreenType): boolean => {
  return CASE_REQUIRED_SCREENS.includes(screen);
};
