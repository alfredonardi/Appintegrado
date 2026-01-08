/**
 * Mock data para Clientes
 */

import { Client, createEmptyClient } from '@/types/client';

export const mockClients: Client[] = [
  {
    id: 'client-001',
    name: 'João Silva Ferreira',
    email: 'joao.silva@example.com',
    phone: '(11) 98765-4321',
    document: '123.456.789-00',
    documentType: 'cpf',
    address: 'Rua A, 100',
    cep: '01234-567',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    status: 'ativo',
    notes: 'Cliente frequente',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
  },
  {
    id: 'client-002',
    name: 'Maria Santos Oliveira',
    email: 'maria.santos@example.com',
    phone: '(11) 99876-5432',
    document: '987.654.321-00',
    documentType: 'cpf',
    address: 'Avenida B, 200',
    cep: '02345-678',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    status: 'ativo',
    notes: '',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: 'client-003',
    name: 'Tech Solutions LTDA',
    email: 'contato@techsolutions.com',
    phone: '(11) 3000-0000',
    document: '12.345.678/0001-90',
    documentType: 'cnpj',
    address: 'Rua C, 300',
    cep: '03456-789',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    status: 'ativo',
    notes: 'Grande cliente',
    createdAt: '2024-01-10T15:30:00Z',
    updatedAt: '2024-01-17T16:00:00Z',
  },
];

/**
 * Obter cliente por ID
 */
export function getMockClientById(id: string): Client | undefined {
  return mockClients.find((c) => c.id === id);
}

/**
 * Obter todos os clientes
 */
export function getAllMockClients(): Client[] {
  return [...mockClients];
}

/**
 * Criar novo cliente (mock)
 */
export function createMockClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
  const newClient: Client = {
    ...data,
    id: `client-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockClients.push(newClient);
  return newClient;
}

/**
 * Atualizar cliente (mock)
 */
export function updateMockClient(id: string, updates: Partial<Client>): Client {
  const index = mockClients.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Client ${id} not found`);
  }
  mockClients[index] = {
    ...mockClients[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockClients[index];
}

/**
 * Deletar cliente (mock)
 */
export function deleteMockClient(id: string): void {
  const index = mockClients.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Client ${id} not found`);
  }
  mockClients.splice(index, 1);
}
