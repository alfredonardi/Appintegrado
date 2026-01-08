/**
 * Service para Casos
 * Abstrai chamadas para API ou mock data
 */

import { Case, createEmptyCase } from '@/types/case';
import { apiClient } from './apiClient';
import {
  getAllMockCases,
  getMockCaseById,
  createMockCase,
  updateMockCase,
} from './mock/mockCases';

const ENDPOINT = '/api/cases';

export class CasesService {
  /**
   * Listar todos os casos
   */
  async getCases(): Promise<Case[]> {
    // Em modo mock, retorna dados fake
    if (apiClient.isMockMode()) {
      return getAllMockCases();
    }

    // Em modo real, faz chamada HTTP
    return apiClient.get<Case[]>(`${ENDPOINT}`);
  }

  /**
   * Obter um caso específico
   */
  async getCaseById(id: string): Promise<Case> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      const mockCase = getMockCaseById(id);
      if (!mockCase) {
        throw new Error(`Case ${id} not found`);
      }
      return mockCase;
    }

    // Em modo real
    return apiClient.get<Case>(`${ENDPOINT}/${id}`);
  }

  /**
   * Criar novo caso
   */
  async createCase(bo: string): Promise<Case> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      return createMockCase(bo);
    }

    // Em modo real
    return apiClient.post<Case>(`${ENDPOINT}`, {
      bo,
      status: 'rascunho',
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Atualizar caso
   */
  async updateCase(id: string, updates: Partial<Case>): Promise<Case> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      return updateMockCase(id, updates);
    }

    // Em modo real
    return apiClient.put<Case>(`${ENDPOINT}/${id}`, updates);
  }

  /**
   * Deletar caso
   */
  async deleteCase(id: string): Promise<void> {
    // Em modo mock, apenas log
    if (apiClient.isMockMode()) {
      console.log(`Mock: delete case ${id}`);
      return;
    }

    // Em modo real
    await apiClient.delete<void>(`${ENDPOINT}/${id}`);
  }

  /**
   * Obter casos por status
   */
  async getCasesByStatus(status: 'rascunho' | 'em_revisao' | 'finalizado'): Promise<Case[]> {
    const cases = await this.getCases();
    return cases.filter((c) => c.status === status);
  }

  /**
   * Atualizar status de um caso
   */
  async updateCaseStatus(
    id: string,
    status: 'rascunho' | 'em_revisao' | 'finalizado'
  ): Promise<Case> {
    return this.updateCase(id, { status });
  }
}

/**
 * Instância global do serviço
 */
export const casesService = new CasesService();
