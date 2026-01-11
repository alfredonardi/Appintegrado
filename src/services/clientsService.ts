/**
 * Service para Clientes
 * Abstrai chamadas para API ou Nhost baseado no data provider
 */

import { Client } from '@/types/client';
import { apiClient } from './apiClient';
import { getDataProvider } from './provider';

const ENDPOINT = '/api/clients';

export class ClientsService {
  /**
   * Listar todos os clientes
   */
  async getClients(): Promise<Client[]> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.get<Client[]>(`${ENDPOINT}`);
  }

  /**
   * Obter um cliente específico
   */
  async getClientById(id: string): Promise<Client> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.get<Client>(`${ENDPOINT}/${id}`);
  }

  /**
   * Criar novo cliente
   */
  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.post<Client>(`${ENDPOINT}`, data);
  }

  /**
   * Atualizar cliente
   */
  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.put<Client>(`${ENDPOINT}/${id}`, updates);
  }

  /**
   * Deletar cliente
   */
  async deleteClient(id: string): Promise<void> {
    const provider = getDataProvider();

    // HTTP provider (default)
    await apiClient.delete<void>(`${ENDPOINT}/${id}`);
  }

  /**
   * Buscar clientes por status
   */
  async getClientsByStatus(status: 'ativo' | 'inativo' | 'bloqueado'): Promise<Client[]> {
    const provider = getDataProvider();

    // HTTP provider: fetch all and filter
    const clients = await this.getClients();
    return clients.filter((c) => c.status === status);
  }

  /**
   * Buscar cliente por email
   */
  async getClientByEmail(email: string): Promise<Client | null> {
    const provider = getDataProvider();

    // HTTP provider: fetch all and find
    const clients = await this.getClients();
    return clients.find((c) => c.email === email) || null;
  }

  /**
   * Buscar cliente por documento
   */
  async getClientByDocument(document: string): Promise<Client | null> {
    const provider = getDataProvider();

    // HTTP provider: fetch all and find
    const clients = await this.getClients();
    return clients.find((c) => c.document === document) || null;
  }
}

/**
 * Instância global do serviço
 */
export const clientsService = new ClientsService();
