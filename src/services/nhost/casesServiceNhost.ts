/**
 * Cases Service para Nhost
 * Implementa CRUD via GraphQL com permissões automáticas
 */

import { Case, createEmptyCase } from '@/types/case';
import { getNhostClientOrThrow } from './nhostClient';

/**
 * GraphQL Queries
 */

// Query: Listar casos do usuário (seu time)
const LIST_MY_CASES = `
  query ListMyCases {
    cases(
      where: {
        team_id: { _eq: "current_user_team" }
      }
      order_by: { created_at: desc }
    ) {
      id
      bo
      natureza
      dataHoraFato
      endereco
      cep
      bairro
      cidade
      estado
      circunscricao
      unidade
      status
      createdAt
      updatedAt
      organization_id
      team_id
      shared_with_org
    }
  }
`;

// Query: Listar casos compartilhados com minha organização (para chefes/delegados)
const LIST_SHARED_CASES = `
  query ListSharedCases {
    cases(
      where: {
        organization_id: { _eq: "current_user_organization" }
        shared_with_org: { _eq: true }
        team_id: { _neq: "current_user_team" }
      }
      order_by: { created_at: desc }
    ) {
      id
      bo
      natureza
      dataHoraFato
      endereco
      cep
      bairro
      cidade
      estado
      circunscricao
      unidade
      status
      createdAt
      updatedAt
      organization_id
      team_id
      shared_with_org
    }
  }
`;

// Query: Obter caso por ID
const GET_CASE_BY_ID = `
  query GetCase($id: uuid!) {
    cases_by_pk(id: $id) {
      id
      bo
      natureza
      dataHoraFato
      endereco
      cep
      bairro
      cidade
      estado
      circunscricao
      unidade
      status
      createdAt
      updatedAt
      organization_id
      team_id
      shared_with_org
    }
  }
`;

// Query: Listar todos os casos de minha organização (para estatísticas)
const LIST_ORG_CASES = `
  query ListOrgCases {
    cases(
      where: {
        organization_id: { _eq: "current_user_organization" }
      }
      order_by: { created_at: desc }
    ) {
      id
      bo
      natureza
      dataHoraFato
      endereco
      cep
      bairro
      cidade
      estado
      circunscricao
      unidade
      status
      createdAt
      updatedAt
      organization_id
      team_id
      shared_with_org
    }
  }
`;

/**
 * GraphQL Mutations
 */

// Mutation: Criar novo caso
const CREATE_CASE = `
  mutation CreateCase($bo: String!, $natureza: String!, $team_id: uuid!) {
    insert_cases_one(
      object: {
        bo: $bo
        natureza: $natureza
        team_id: $team_id
        organization_id: "current_user_organization"
        status: "rascunho"
        shared_with_org: false
        dataHoraFato: "now()"
        endereco: ""
        cep: ""
        circunscricao: ""
        unidade: ""
        createdAt: "now()"
        updatedAt: "now()"
      }
    ) {
      id
      bo
      natureza
      dataHoraFato
      endereco
      cep
      bairro
      cidade
      estado
      circunscricao
      unidade
      status
      createdAt
      updatedAt
      organization_id
      team_id
      shared_with_org
    }
  }
`;

// Mutation: Atualizar caso
const UPDATE_CASE = `
  mutation UpdateCase($id: uuid!, $updates: cases_set_input!) {
    update_cases_by_pk(pk_columns: { id: $id }, _set: $updates) {
      id
      bo
      natureza
      dataHoraFato
      endereco
      cep
      bairro
      cidade
      estado
      circunscricao
      unidade
      status
      createdAt
      updatedAt
      organization_id
      team_id
      shared_with_org
    }
  }
`;

// Mutation: Deletar caso
const DELETE_CASE = `
  mutation DeleteCase($id: uuid!) {
    delete_cases_by_pk(id: $id) {
      id
    }
  }
`;

// Mutation: Compartilhar caso com organização
const SHARE_CASE_WITH_ORG = `
  mutation ShareCaseWithOrg($id: uuid!, $shared: Boolean!) {
    update_cases_by_pk(pk_columns: { id: $id }, _set: { shared_with_org: $shared }) {
      id
      shared_with_org
    }
  }
`;

/**
 * Service Class
 */
export class CasesServiceNhost {
  /**
   * Listar casos para o usuário logado
   * - Investigadores: apenas casos do seu time
   * - Chefes/Delegados: casos do seu time + casos compartilhados da org
   */
  async getCases(): Promise<Case[]> {
    const client = getNhostClientOrThrow();
    const user = client.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    // TODO: Implementar lógica de role
    // Por enquanto retorna mock vazio
    return [];
  }

  /**
   * Obter caso por ID
   */
  async getCaseById(id: string): Promise<Case> {
    const client = getNhostClientOrThrow();

    try {
      const response = await client.graphQL(GET_CASE_BY_ID, { id });
      const caseData = response.data?.cases_by_pk;

      if (!caseData) {
        throw new Error(`Case ${id} not found`);
      }

      return this.mapNhostToCase(caseData);
    } catch (error) {
      console.error('[Nhost] Failed to get case:', error);
      throw error;
    }
  }

  /**
   * Criar novo caso
   */
  async createCase(bo: string, natureza: string = ''): Promise<Case> {
    const client = getNhostClientOrThrow();
    const user = client.getUser();

    if (!user || !user.team_id) {
      throw new Error('User must be in a team to create cases');
    }

    try {
      const response = await client.graphQL(CREATE_CASE, {
        bo,
        natureza,
        team_id: user.team_id,
      });

      const caseData = response.data?.insert_cases_one;
      if (!caseData) {
        throw new Error('Failed to create case');
      }

      return this.mapNhostToCase(caseData);
    } catch (error) {
      console.error('[Nhost] Failed to create case:', error);
      throw error;
    }
  }

  /**
   * Atualizar caso
   */
  async updateCase(id: string, updates: Partial<Case>): Promise<Case> {
    const client = getNhostClientOrThrow();

    // Mapear campos da aplicação para schema Nhost
    const nhostUpdates: Record<string, unknown> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        nhostUpdates[key] = value;
      }
    });

    nhostUpdates.updatedAt = new Date().toISOString();

    try {
      const response = await client.graphQL(UPDATE_CASE, {
        id,
        updates: nhostUpdates,
      });

      const caseData = response.data?.update_cases_by_pk;
      if (!caseData) {
        throw new Error('Failed to update case');
      }

      return this.mapNhostToCase(caseData);
    } catch (error) {
      console.error('[Nhost] Failed to update case:', error);
      throw error;
    }
  }

  /**
   * Deletar caso
   */
  async deleteCase(id: string): Promise<void> {
    const client = getNhostClientOrThrow();

    try {
      await client.graphQL(DELETE_CASE, { id });
    } catch (error) {
      console.error('[Nhost] Failed to delete case:', error);
      throw error;
    }
  }

  /**
   * Compartilhar caso com chefia (organização)
   */
  async shareCaseWithOrg(id: string, shared: boolean = true): Promise<Case> {
    const client = getNhostClientOrThrow();

    try {
      const response = await client.graphQL(SHARE_CASE_WITH_ORG, { id, shared });

      const caseData = response.data?.update_cases_by_pk;
      if (!caseData) {
        throw new Error('Failed to share case');
      }

      return this.mapNhostToCase(caseData);
    } catch (error) {
      console.error('[Nhost] Failed to share case:', error);
      throw error;
    }
  }

  /**
   * Listar casos por status
   */
  async getCasesByStatus(status: 'rascunho' | 'em_revisao' | 'finalizado'): Promise<Case[]> {
    const cases = await this.getCases();
    return cases.filter((c) => c.status === status);
  }

  /**
   * Helper: mapear resposta Nhost para tipo Case
   */
  private mapNhostToCase(nhostData: any): Case {
    return {
      id: nhostData.id,
      bo: nhostData.bo,
      natureza: nhostData.natureza || '',
      dataHoraFato: nhostData.dataHoraFato || new Date().toISOString(),
      endereco: nhostData.endereco || '',
      cep: nhostData.cep || '',
      bairro: nhostData.bairro,
      cidade: nhostData.cidade,
      estado: nhostData.estado,
      circunscricao: nhostData.circunscricao || '',
      unidade: nhostData.unidade || '',
      status: nhostData.status || 'rascunho',
      createdAt: nhostData.createdAt,
      updatedAt: nhostData.updatedAt,
      organization_id: nhostData.organization_id,
      team_id: nhostData.team_id,
      shared_with_org: nhostData.shared_with_org || false,
      team: [],
      events: [],
      photos: [],
      fieldValues: [],
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
        lastUpdated: new Date().toISOString(),
      },
      photoReport: {
        selectedPhotos: [],
        layout: '1-per-page',
        includeCover: true,
        includeHeaderFooter: true,
        lastUpdated: new Date().toISOString(),
      },
      investigationReport: {
        blocks: [],
        signatures: {
          responsible1Name: '',
          responsible1Role: '',
          responsible2Name: '',
          responsible2Role: '',
          location: '',
          date: '',
        },
        lastUpdated: new Date().toISOString(),
      },
      generatedPDFs: [],
      auditLog: [],
    };
  }
}

/**
 * Instância global do serviço
 */
export const casesServiceNhost = new CasesServiceNhost();
