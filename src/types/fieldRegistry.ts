// =============================================================================
// Registry de Campos Canônicos
// Define onde cada campo é usado para evitar duplicação
// =============================================================================

export interface FieldDefinition {
  key: string;
  label: string;
  section: string;
  description: string;
  usedIn: string[]; // telas que usam esse campo
  required: boolean;
  type: 'text' | 'date' | 'datetime' | 'number' | 'select' | 'textarea';
  options?: string[]; // para campos select
}

// Mapa de uso de campos por tela
export const FIELD_USAGE_MAP: Record<string, string[]> = {
  recognition: [
    'case.bo',
    'case.natureza',
    'case.dataHoraFato',
    'location.endereco',
    'location.cep',
    'location.bairro',
    'location.cidade',
    'location.circunscricao',
    'location.unidade',
    'environment.iluminacao',
    'environment.tipoVia',
    'environment.clima',
    'environment.temperatura',
    'environment.visibilidade',
    'security.cameras',
    'security.camerasDescricao',
    'team.members',
    'events.acionamento',
    'events.chegada',
    'events.liberacao',
    'events.termino',
  ],
  photoReport: [
    'case.bo',
    'case.natureza',
    'case.dataHoraFato',
    'location.endereco',
  ],
  investigationReport: [
    'case.bo',
    'case.natureza',
    'case.dataHoraFato',
    'location.endereco',
    'location.cep',
    'location.bairro',
    'location.cidade',
    'environment.iluminacao',
    'environment.tipoVia',
    'environment.clima',
    'security.cameras',
    'security.camerasDescricao',
    'team.members',
    'events.acionamento',
    'events.chegada',
    'events.liberacao',
    'events.termino',
  ],
  export: ['*'], // usa todos os campos
};

// Definição completa de todos os campos canônicos
export const CANONICAL_FIELDS: FieldDefinition[] = [
  // === Dados do Caso ===
  {
    key: 'case.bo',
    label: 'Boletim de Ocorrência',
    section: 'case',
    description: 'Número do BO',
    usedIn: ['recognition', 'photoReport', 'investigationReport', 'export'],
    required: true,
    type: 'text',
  },
  {
    key: 'case.natureza',
    label: 'Natureza',
    section: 'case',
    description: 'Tipo de ocorrência (ex: Homicídio, Roubo)',
    usedIn: ['recognition', 'photoReport', 'investigationReport', 'export'],
    required: true,
    type: 'select',
    options: [
      'Homicídio',
      'Roubo',
      'Furto',
      'Latrocínio',
      'Lesão Corporal',
      'Acidente de Trânsito',
      'Incêndio',
      'Outros',
    ],
  },
  {
    key: 'case.dataHoraFato',
    label: 'Data/Hora do Fato',
    section: 'case',
    description: 'Momento em que o fato ocorreu',
    usedIn: ['recognition', 'photoReport', 'investigationReport', 'export'],
    required: true,
    type: 'datetime',
  },

  // === Localização ===
  {
    key: 'location.endereco',
    label: 'Endereço Completo',
    section: 'location',
    description: 'Endereço onde ocorreu o fato',
    usedIn: ['recognition', 'photoReport', 'investigationReport', 'export'],
    required: true,
    type: 'textarea',
  },
  {
    key: 'location.cep',
    label: 'CEP',
    section: 'location',
    description: 'Código postal',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'text',
  },
  {
    key: 'location.bairro',
    label: 'Bairro',
    section: 'location',
    description: 'Bairro da ocorrência',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'text',
  },
  {
    key: 'location.cidade',
    label: 'Cidade',
    section: 'location',
    description: 'Cidade da ocorrência',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'text',
  },
  {
    key: 'location.circunscricao',
    label: 'Circunscrição',
    section: 'location',
    description: 'Circunscrição policial',
    usedIn: ['recognition', 'export'],
    required: false,
    type: 'text',
  },
  {
    key: 'location.unidade',
    label: 'Unidade',
    section: 'location',
    description: 'Unidade policial responsável',
    usedIn: ['recognition', 'export'],
    required: false,
    type: 'text',
  },

  // === Ambiente ===
  {
    key: 'environment.iluminacao',
    label: 'Iluminação',
    section: 'environment',
    description: 'Condição de iluminação no local',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'select',
    options: [
      'Natural (dia)',
      'Artificial (noite)',
      'Mista',
      'Insuficiente',
      'Ausente',
    ],
  },
  {
    key: 'environment.tipoVia',
    label: 'Tipo de Via',
    section: 'environment',
    description: 'Tipo de via onde ocorreu o fato',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'select',
    options: [
      'Via pública (asfalto)',
      'Via pública (paralelepípedo)',
      'Via pública (terra)',
      'Via particular',
      'Área interna',
      'Área rural',
    ],
  },
  {
    key: 'environment.clima',
    label: 'Condições Climáticas',
    section: 'environment',
    description: 'Clima no momento do fato',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'select',
    options: ['Céu limpo', 'Parcialmente nublado', 'Nublado', 'Chuvoso', 'Tempestade'],
  },
  {
    key: 'environment.temperatura',
    label: 'Temperatura',
    section: 'environment',
    description: 'Temperatura aproximada',
    usedIn: ['recognition', 'export'],
    required: false,
    type: 'text',
  },
  {
    key: 'environment.visibilidade',
    label: 'Visibilidade',
    section: 'environment',
    description: 'Condição de visibilidade no local',
    usedIn: ['recognition', 'export'],
    required: false,
    type: 'select',
    options: ['Boa', 'Regular', 'Ruim', 'Muito ruim'],
  },

  // === Segurança e Câmeras ===
  {
    key: 'security.cameras',
    label: 'Câmeras Identificadas',
    section: 'security',
    description: 'Se há câmeras no local',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'select',
    options: ['Sim', 'Não', 'Não verificado'],
  },
  {
    key: 'security.camerasDescricao',
    label: 'Descrição das Câmeras',
    section: 'security',
    description: 'Detalhes sobre as câmeras identificadas',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'textarea',
  },
  {
    key: 'security.camerasQuantidade',
    label: 'Quantidade de Câmeras',
    section: 'security',
    description: 'Número de câmeras identificadas',
    usedIn: ['recognition', 'export'],
    required: false,
    type: 'number',
  },

  // === Equipe ===
  {
    key: 'team.delegado',
    label: 'Delegado Responsável',
    section: 'team',
    description: 'Nome do delegado',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'text',
  },
  {
    key: 'team.escrivao',
    label: 'Escrivão',
    section: 'team',
    description: 'Nome do escrivão',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'text',
  },
  {
    key: 'team.investigador',
    label: 'Investigador',
    section: 'team',
    description: 'Nome do investigador',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'text',
  },
  {
    key: 'team.fotografo',
    label: 'Fotógrafo',
    section: 'team',
    description: 'Nome do fotógrafo técnico',
    usedIn: ['recognition', 'export'],
    required: false,
    type: 'text',
  },

  // === Eventos/Timeline ===
  {
    key: 'events.acionamento',
    label: 'Acionamento',
    section: 'events',
    description: 'Horário do acionamento da equipe',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'datetime',
  },
  {
    key: 'events.chegada',
    label: 'Chegada ao Local',
    section: 'events',
    description: 'Horário de chegada no local',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'datetime',
  },
  {
    key: 'events.liberacao',
    label: 'Liberação do Local',
    section: 'events',
    description: 'Horário de liberação do local',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'datetime',
  },
  {
    key: 'events.termino',
    label: 'Término dos Trabalhos',
    section: 'events',
    description: 'Horário de término dos trabalhos',
    usedIn: ['recognition', 'investigationReport', 'export'],
    required: false,
    type: 'datetime',
  },

  // === Comunicações ===
  {
    key: 'communications.fonte',
    label: 'Fonte da Comunicação',
    section: 'communications',
    description: 'Como a ocorrência foi comunicada',
    usedIn: ['recognition', 'export'],
    required: false,
    type: 'select',
    options: ['190', 'COPOM', 'Denúncia', 'Flagrante', 'Outros'],
  },
  {
    key: 'communications.protocolo',
    label: 'Protocolo',
    section: 'communications',
    description: 'Número do protocolo de comunicação',
    usedIn: ['recognition', 'export'],
    required: false,
    type: 'text',
  },
];

// Função para obter campos por seção
export const getFieldsBySection = (section: string): FieldDefinition[] => {
  return CANONICAL_FIELDS.filter((f) => f.section === section);
};

// Função para obter campo por chave
export const getFieldByKey = (key: string): FieldDefinition | undefined => {
  return CANONICAL_FIELDS.find((f) => f.key === key);
};

// Função para obter campos usados em uma tela específica
export const getFieldsUsedIn = (screen: string): FieldDefinition[] => {
  return CANONICAL_FIELDS.filter((f) => f.usedIn.includes(screen));
};

// Função para obter onde um campo é reutilizado
export const getFieldReuse = (key: string): string[] => {
  const field = getFieldByKey(key);
  return field ? field.usedIn : [];
};

// Seções do reconhecimento com seus campos
export const RECOGNITION_SECTIONS = {
  preliminary: {
    id: 'preliminary',
    label: 'Informações Preliminares',
    fields: ['case.bo', 'case.natureza', 'case.dataHoraFato'],
  },
  communications: {
    id: 'communications',
    label: 'Comunicações',
    fields: ['communications.fonte', 'communications.protocolo'],
  },
  team: {
    id: 'team',
    label: 'Equipe',
    fields: ['team.delegado', 'team.escrivao', 'team.investigador', 'team.fotografo'],
  },
  weather: {
    id: 'weather',
    label: 'Condições Climáticas',
    fields: [
      'environment.clima',
      'environment.temperatura',
      'environment.iluminacao',
      'environment.visibilidade',
    ],
  },
  location: {
    id: 'location',
    label: 'Localização',
    fields: [
      'location.endereco',
      'location.cep',
      'location.bairro',
      'location.cidade',
      'location.circunscricao',
      'location.unidade',
      'environment.tipoVia',
    ],
  },
  evidence: {
    id: 'evidence',
    label: 'Vestígios e Evidências',
    fields: ['security.cameras', 'security.camerasDescricao', 'security.camerasQuantidade'],
  },
};

// Alias para exportação
export const SECTION_LABELS: Record<string, string> = {
  preliminary: 'Informações Preliminares',
  communications: 'Comunicações',
  team: 'Equipe',
  weather: 'Condições Climáticas',
  location: 'Localização',
  evidence: 'Vestígios e Evidências',
};
