/**
 * Service para Clientes
 * Abstrai chamadas para API ou mock data
 */

import { Client } from '@/types/client';
import { apiClient } from './apiClient';
import {
  getAllMockClients,
  getMockClientById,
  createMockClient,
  updateMockClient,
  deleteMockClient,
} from './mock/mockClients';

const ENDPOINT = '/api/clients';

export class ClientsService {
  /**
   * Listar todos os clientes
   */
  async getClients(): Promise<Client[]> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      return getAllMockClients();
    }

    // Em modo real
    return apiClient.get<Client[]>(`${ENDPOINT}`);
  }

  /**
   * Obter um cliente específico
   */
  async getClientById(id: string): Promise<Client> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      const mockClient = getMockClientById(id);
      if (!mockClient) {
        throw new Error(`Client ${id} not found`);
      }
      return mockClient;
    }

    // Em modo real
    return apiClient.get<Client>(`${ENDPOINT}/${id}`);
  }

  /**
   * Criar novo cliente
   */
  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      return createMockClient(data);
    }

    // Em modo real
    return apiClient.post<Client>(`${ENDPOINT}`, data);
  }

  /**
   * Atualizar cliente
   */
  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      return updateMockClient(id, updates);
    }

    // Em modo real
    return apiClient.put<Client>(`${ENDPOINT}/${id}`, updates);
  }

  /**
   * Deletar cliente
   */
  async deleteClient(id: string): Promise<void> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      deleteMockClient(id);
      return;
    }

    // Em modo real
    await apiClient.delete<void>(`${ENDPOINT}/${id}`);
  }

  /**
   * Buscar clientes por status
   */
  async getClientsByStatus(status: 'ativo' | 'inativo' | 'bloqueado'): Promise<Client[]> {
    const clients = await this.getClients();
    return clients.filter((c) => c.status === status);
  }

  /**
   * Buscar cliente por email
   */
  async getClientByEmail(email: string): Promise<Client | null> {
    const clients = await this.getClients();
    return clients.find((c) => c.email === email) || null;
  }

  /**
   * Buscar cliente por documento
   */
  async getClientByDocument(document: string): Promise<Client | null> {
    const clients = await this.getClients();
    return clients.find((c) => c.document === document) || null;
  }
}

/**
 * Instância global do serviço
 */
export const clientsService = new ClientsService();
