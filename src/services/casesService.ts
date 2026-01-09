/**
 * Service para Casos
 * Abstrai chamadas para API, mock data, ou Supabase baseado no data provider
 */

import { Case, CaseStatus, createEmptyCase } from '@/types/case';
import { apiClient } from './apiClient';
import { getDataProvider } from './provider';
import {
  getAllMockCases,
  getMockCaseById,
  createMockCase,
  updateMockCase,
  deleteMockCase,
} from './mock/mockCases';
import * as casesServiceSupabase from './supabase/casesServiceSupabase';
import { casesServiceNhost } from './nhost/casesServiceNhost';

const ENDPOINT = '/api/cases';

export class CasesService {
  /**
   * Listar todos os casos
   */
  async getCases(): Promise<Case[]> {
    const provider = getDataProvider();

    // Nhost provider
    if (provider === 'nhost') {
      return casesServiceNhost.getCases();
    }

    // Supabase provider
    if (provider === 'supabase') {
      return casesServiceSupabase.getCases();
    }

    // Mock provider
    if (provider === 'mock') {
      return getAllMockCases();
    }

    // HTTP provider (default)
    return apiClient.get<Case[]>(`${ENDPOINT}`);
  }

  /**
   * Obter um caso específico
   */
  async getCaseById(id: string): Promise<Case> {
    const provider = getDataProvider();

    // Nhost provider
    if (provider === 'nhost') {
      return casesServiceNhost.getCaseById(id);
    }

    // Supabase provider
    if (provider === 'supabase') {
      return casesServiceSupabase.getCaseById(id);
    }

    // Mock provider
    if (provider === 'mock') {
      const mockCase = getMockCaseById(id);
      if (!mockCase) {
        throw new Error(`Case ${id} not found`);
      }
      return mockCase;
    }

    // HTTP provider (default)
    return apiClient.get<Case>(`${ENDPOINT}/${id}`);
  }

  /**
   * Criar novo caso
   */
  async createCase(bo: string): Promise<Case> {
    const provider = getDataProvider();

    // Nhost provider
    if (provider === 'nhost') {
      return casesServiceNhost.createCase(bo);
    }

    // Supabase provider
    if (provider === 'supabase') {
      return casesServiceSupabase.createCase(bo);
    }

    // Mock provider
    if (provider === 'mock') {
      return createMockCase(bo);
    }

    // HTTP provider (default)
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
    const provider = getDataProvider();

    // Nhost provider
    if (provider === 'nhost') {
      return casesServiceNhost.updateCase(id, updates);
    }

    // Supabase provider
    if (provider === 'supabase') {
      return casesServiceSupabase.updateCase(id, updates);
    }

    // Mock provider
    if (provider === 'mock') {
      return updateMockCase(id, updates);
    }

    // HTTP provider (default)
    return apiClient.put<Case>(`${ENDPOINT}/${id}`, updates);
  }

  /**
   * Deletar caso
   */
  async deleteCase(id: string): Promise<void> {
    const provider = getDataProvider();

    // Nhost provider
    if (provider === 'nhost') {
      return casesServiceNhost.deleteCase(id);
    }

    // Supabase provider
    if (provider === 'supabase') {
      return casesServiceSupabase.deleteCase(id);
    }

    // Mock provider
    if (provider === 'mock') {
      return deleteMockCase(id);
    }

    // HTTP provider (default)
    await apiClient.delete<void>(`${ENDPOINT}/${id}`);
  }

  /**
   * Obter casos por status
   */
  async getCasesByStatus(status: 'rascunho' | 'em_revisao' | 'finalizado'): Promise<Case[]> {
    const provider = getDataProvider();

    // Supabase provider has native filtering
    if (provider === 'supabase') {
      return casesServiceSupabase.getCasesByStatus(status);
    }

    // Mock and HTTP providers: fetch all and filter
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
