/**
 * Service para Clientes
 * Usa exclusivamente Nhost como backend
 */

import { Client } from '@/types/client';

export class ClientsService {
  /**
   * Listar todos os clientes
   */
  async getClients(): Promise<Client[]> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Obter um cliente específico
   */
  async getClientById(id: string): Promise<Client> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Criar novo cliente
   */
  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Atualizar cliente
   */
  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Deletar cliente
   */
  async deleteClient(id: string): Promise<void> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Buscar clientes por status
   */
  async getClientsByStatus(status: 'ativo' | 'inativo' | 'bloqueado'): Promise<Client[]> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Buscar cliente por email
   */
  async getClientByEmail(email: string): Promise<Client | null> {
    throw new Error('Nhost implementation not yet available for this service');
  }

  /**
   * Buscar cliente por documento
   */
  async getClientByDocument(document: string): Promise<Client | null> {
    throw new Error('Nhost implementation not yet available for this service');
  }
}

/**
 * Instância global do serviço
 */
export const clientsService = new ClientsService();
