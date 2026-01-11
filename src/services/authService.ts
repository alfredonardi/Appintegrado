/**
 * Service para Autenticação
 * Abstrai chamadas para API ou Nhost baseado no data provider
 */

import { apiClient } from './apiClient';
import { User } from './mock/mockUsers';
import { getDataProvider } from './provider';

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
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.post<LoginResponse>(`${ENDPOINT}/login`, {
      email,
      password,
    });
  }

  /**
   * Logout - Limpar sessão
   */
  async logout(): Promise<void> {
    const provider = getDataProvider();

    // HTTP provider (default)
    await apiClient.post<void>(`${ENDPOINT}/logout`, {});
  }

  /**
   * Registrar novo usuário
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.post<LoginResponse>(`${ENDPOINT}/register`, data);
  }

  /**
   * Validar token
   */
  async validateToken(token: string): Promise<User> {
    const provider = getDataProvider();

    // HTTP provider (default)
    return apiClient.get<User>(`${ENDPOINT}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Obter usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    const provider = getDataProvider();

    // HTTP provider
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
    const provider = getDataProvider();

    // HTTP provider (default)
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
