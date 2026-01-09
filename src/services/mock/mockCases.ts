/**
 * Mock data para Casos
 */

import { Case, createEmptyCase } from '@/types/case';

export const mockCases: Case[] = [
  {
    ...createEmptyCase('case-001', 'BO-2024-001'),
    id: 'case-001',
    bo: 'BO-2024-001',
    natureza: 'Roubo em Residência',
    dataHoraFato: '2024-01-15T14:30:00Z',
    endereco: 'Rua das Flores, 123',
    cep: '01234-567',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    circunscricao: 'Polícia Judiciária',
    unidade: '1º Distrito Policial',
    status: 'em_revisao',
    createdAt: '2024-01-15T15:00:00Z',
    updatedAt: '2024-01-16T10:30:00Z',
    team: [
      {
        id: 'user-001',
        role: 'Delegado',
        name: 'Dr. João Silva',
        badge: 'DG-001',
      },
      {
        id: 'user-002',
        role: 'Investigador',
        name: 'Carlos Santos',
        badge: 'INV-001',
      },
      {
        id: 'user-003',
        role: 'Fotógrafo',
        name: 'Maria Oliveira',
        badge: 'FOT-001',
      },
    ],
    events: [
      {
        id: 'evt-001',
        type: 'acionamento',
        label: 'Acionamento da Polícia',
        timestamp: '2024-01-15T14:35:00Z',
        description: 'Chamada recebida no 190',
      },
      {
        id: 'evt-002',
        type: 'chegada',
        label: 'Chegada no Local',
        timestamp: '2024-01-15T14:50:00Z',
        description: 'Equipe chegou no local dos fatos',
      },
      {
        id: 'evt-003',
        type: 'liberacao',
        label: 'Liberação do Local',
        timestamp: '2024-01-15T18:30:00Z',
      },
    ],
    photos: [],
    fieldValues: [
      {
        key: 'case.bo',
        value: 'BO-2024-001',
        status: 'confirmed',
        sources: ['Manual'],
        lastUpdated: '2024-01-15T15:00:00Z',
        updatedBy: 'Dr. João Silva',
      },
      {
        key: 'location.endereco',
        value: 'Rua das Flores, 123',
        status: 'confirmed',
        sources: ['Manual'],
        lastUpdated: '2024-01-15T15:00:00Z',
        updatedBy: 'Dr. João Silva',
      },
    ],
    aiExtractions: [],
    recognition: {
      sections: {
        preliminary: [],
        communications: [],
        team: [],
        weather: [],
        location: [],
        evidence: [],
      },
      completedSections: [],
      lastUpdated: '2024-01-15T15:00:00Z',
    },
    photoReport: {
      selectedPhotos: [],
      layout: '1-per-page',
      includeCover: true,
      includeHeaderFooter: true,
      lastUpdated: '2024-01-15T15:00:00Z',
    },
    investigationReport: {
      blocks: [
        {
          id: 'summary',
          title: 'Resumo Executivo',
          content: 'Caso de roubo em residência com suspeita de arrombamento',
          status: 'draft',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-16T10:00:00Z',
        },
        {
          id: 'dynamics',
          title: 'Dinâmica dos Fatos',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-15T15:00:00Z',
        },
        {
          id: 'victims',
          title: 'Vítimas e Envolvidos',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-15T15:00:00Z',
        },
        {
          id: 'police',
          title: 'Ação Policial',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-15T15:00:00Z',
        },
        {
          id: 'procedures',
          title: 'Procedimentos Realizados',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-15T15:00:00Z',
        },
        {
          id: 'cameras',
          title: 'Câmeras e Vigilância',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-15T15:00:00Z',
        },
        {
          id: 'conclusion',
          title: 'Conclusão',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-15T15:00:00Z',
        },
      ],
      signatures: {
        responsible1Name: 'Dr. João Silva',
        responsible1Role: 'Delegado',
        responsible2Name: 'Carlos Santos',
        responsible2Role: 'Investigador',
        location: 'São Paulo',
        date: '',
      },
      lastUpdated: '2024-01-15T15:00:00Z',
    },
    generatedPDFs: [],
    auditLog: [
      {
        id: 'audit-001',
        type: 'CASE_CREATED',
        timestamp: '2024-01-15T15:00:00Z',
        user: 'Dr. João Silva',
        details: { caseId: 'case-001', bo: 'BO-2024-001' },
      },
      {
        id: 'audit-002',
        type: 'CASE_UPDATED',
        timestamp: '2024-01-16T10:30:00Z',
        user: 'Carlos Santos',
        details: { caseId: 'case-001', field: 'status', value: 'em_revisao' },
      },
    ],
  },
  {
    ...createEmptyCase('case-002', 'BO-2024-002'),
    id: 'case-002',
    bo: 'BO-2024-002',
    natureza: 'Homicídio',
    dataHoraFato: '2024-01-18T22:15:00Z',
    endereco: 'Avenida Brasil, 456',
    cep: '02345-678',
    bairro: 'Vila Mariana',
    cidade: 'São Paulo',
    estado: 'SP',
    circunscricao: 'Polícia Judiciária',
    unidade: '2º Distrito Policial',
    status: 'rascunho',
    createdAt: '2024-01-18T22:30:00Z',
    updatedAt: '2024-01-18T23:45:00Z',
    team: [
      {
        id: 'user-004',
        role: 'Delegado',
        name: 'Dr. Pedro Costa',
        badge: 'DG-002',
      },
      {
        id: 'user-005',
        role: 'Investigador',
        name: 'Ana Paula Ferreira',
        badge: 'INV-002',
      },
    ],
    events: [
      {
        id: 'evt-004',
        type: 'acionamento',
        label: 'Acionamento da Polícia',
        timestamp: '2024-01-18T22:20:00Z',
      },
    ],
    photos: [],
    fieldValues: [
      {
        key: 'case.bo',
        value: 'BO-2024-002',
        status: 'confirmed',
        sources: ['Manual'],
        lastUpdated: '2024-01-18T22:30:00Z',
        updatedBy: 'Dr. Pedro Costa',
      },
    ],
    aiExtractions: [],
    recognition: {
      sections: {
        preliminary: [],
        communications: [],
        team: [],
        weather: [],
        location: [],
        evidence: [],
      },
      completedSections: [],
      lastUpdated: '2024-01-18T22:30:00Z',
    },
    photoReport: {
      selectedPhotos: [],
      layout: '1-per-page',
      includeCover: true,
      includeHeaderFooter: true,
      lastUpdated: '2024-01-18T22:30:00Z',
    },
    investigationReport: {
      blocks: [
        {
          id: 'summary',
          title: 'Resumo Executivo',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-18T22:30:00Z',
        },
        {
          id: 'dynamics',
          title: 'Dinâmica dos Fatos',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-18T22:30:00Z',
        },
        {
          id: 'victims',
          title: 'Vítimas e Envolvidos',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-18T22:30:00Z',
        },
        {
          id: 'police',
          title: 'Ação Policial',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-18T22:30:00Z',
        },
        {
          id: 'procedures',
          title: 'Procedimentos Realizados',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-18T22:30:00Z',
        },
        {
          id: 'cameras',
          title: 'Câmeras e Vigilância',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-18T22:30:00Z',
        },
        {
          id: 'conclusion',
          title: 'Conclusão',
          content: '',
          status: 'empty',
          referencedFieldKeys: [],
          referencedPhotoIds: [],
          aiGenerated: false,
          lastUpdated: '2024-01-18T22:30:00Z',
        },
      ],
      signatures: {
        responsible1Name: 'Dr. Pedro Costa',
        responsible1Role: 'Delegado',
        responsible2Name: 'Ana Paula Ferreira',
        responsible2Role: 'Investigador',
        location: 'São Paulo',
        date: '',
      },
      lastUpdated: '2024-01-18T22:30:00Z',
    },
    generatedPDFs: [],
    auditLog: [
      {
        id: 'audit-003',
        type: 'CASE_CREATED',
        timestamp: '2024-01-18T22:30:00Z',
        user: 'Dr. Pedro Costa',
        details: { caseId: 'case-002', bo: 'BO-2024-002' },
      },
    ],
  },
];

/**
 * Obter caso por ID
 */
export function getMockCaseById(id: string): Case | undefined {
  return mockCases.find((c) => c.id === id);
}

/**
 * Obter todos os casos
 */
export function getAllMockCases(): Case[] {
  return [...mockCases];
}

/**
 * Criar novo caso (mock)
 */
export function createMockCase(bo: string): Case {
  const newCase = createEmptyCase(`case-${Date.now()}`, bo);
  mockCases.push(newCase);
  return newCase;
}

/**
 * Atualizar caso (mock)
 */
export function updateMockCase(id: string, updates: Partial<Case>): Case {
  const index = mockCases.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Case ${id} not found`);
  }
  mockCases[index] = { ...mockCases[index], ...updates, updatedAt: new Date().toISOString() };
  return mockCases[index];
}

/**
 * Deletar caso (mock)
 */
export function deleteMockCase(id: string): void {
  const index = mockCases.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Case ${id} not found`);
  }
  mockCases.splice(index, 1);
}
