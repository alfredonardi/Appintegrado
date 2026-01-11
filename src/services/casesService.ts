/**
 * Service para Casos
 * Usa exclusivamente Nhost como backend
 */

import { Case, CaseStatus } from '@/types/case';
import { casesServiceNhost } from './nhost/casesServiceNhost';

export class CasesService {
  /**
   * Listar todos os casos
   */
  async getCases(): Promise<Case[]> {
    return casesServiceNhost.getCases();
  }

  /**
   * Obter um caso específico
   */
  async getCaseById(id: string): Promise<Case> {
    return casesServiceNhost.getCaseById(id);
  }

  /**
   * Criar novo caso
   */
  async createCase(bo: string): Promise<Case> {
    return casesServiceNhost.createCase(bo);
  }

  /**
   * Atualizar caso
   */
  async updateCase(id: string, updates: Partial<Case>): Promise<Case> {
    return casesServiceNhost.updateCase(id, updates);
  }

  /**
   * Deletar caso
   */
  async deleteCase(id: string): Promise<void> {
    return casesServiceNhost.deleteCase(id);
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
    status: CaseStatus
  ): Promise<Case> {
    return this.updateCase(id, { status });
  }
}

/**
 * Instância global do serviço
 */
export const casesService = new CasesService();
