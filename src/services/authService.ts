/**
 * Service para Autenticação
 * Abstrai chamadas para API ou mock data
 */

import { apiClient } from './apiClient';
import { getMockUserByEmail, User } from './mock/mockUsers';

const ENDPOINT = '/api/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export class AuthService {
  /**
   * Login - Autenticação do usuário
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      // Simular validação
      if (!email || !password) {
        throw new Error('Email and password required');
      }

      // Buscar usuário mock (se existir) ou criar genérico
      const mockUser = getMockUserByEmail(email);
      const user: User = mockUser || {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'Investigador',
        status: 'ativo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Gerar token fake (btoa encoding - NÃO SEGURO, apenas para dev)
      const token = btoa(`${email}:${Date.now()}`);

      return { token, user };
    }

    // Em modo real
    return apiClient.post<LoginResponse>(`${ENDPOINT}/login`, {
      email,
      password,
    });
  }

  /**
   * Logout - Limpar sessão
   */
  async logout(): Promise<void> {
    // Em modo mock, apenas log
    if (apiClient.isMockMode()) {
      console.log('Mock: logout');
      return;
    }

    // Em modo real
    await apiClient.post<void>(`${ENDPOINT}/logout`, {});
  }

  /**
   * Registrar novo usuário
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      if (!data.email || !data.password || !data.name) {
        throw new Error('Name, email, and password required');
      }

      const user: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role || 'Investigador',
        status: 'ativo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = btoa(`${data.email}:${Date.now()}`);
      return { token, user };
    }

    // Em modo real
    return apiClient.post<LoginResponse>(`${ENDPOINT}/register`, data);
  }

  /**
   * Validar token
   */
  async validateToken(token: string): Promise<User> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      // Token mock é base64 de "email:timestamp"
      try {
        const decoded = atob(token);
        const [email] = decoded.split(':');

        const mockUser = getMockUserByEmail(email);
        if (mockUser) {
          return mockUser;
        }

        // Se não encontrar, criar usuário genérico
        return {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: 'Investigador',
          status: 'ativo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } catch {
        throw new Error('Invalid token');
      }
    }

    // Em modo real
    return apiClient.get<User>(`${ENDPOINT}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Obter usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('casehub-auth-token');
    if (!token) {
      return null;
    }

    try {
      return await this.validateToken(token);
    } catch {
      return null;
    }
  }

  /**
   * Alterar senha
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Em modo mock
    if (apiClient.isMockMode()) {
      console.log('Mock: change password');
      return;
    }

    // Em modo real
    await apiClient.post<void>(`${ENDPOINT}/change-password`, {
      currentPassword,
      newPassword,
    });
  }
}

/**
 * Instância global do serviço
 */
export const authService = new AuthService();
