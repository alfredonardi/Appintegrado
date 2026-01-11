/**
 * Service para Autenticação
 * Abstrai chamadas para API, mock data, ou Supabase baseado no data provider
 */

import { apiClient } from './apiClient';
import { User } from './mock/mockUsers';
import { getDataProvider } from './provider';
import * as authServiceSupabase from './supabase/authServiceSupabase';

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

    // Supabase provider
    if (provider === 'supabase') {
      return authServiceSupabase.login(email, password);
    }

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

    // Supabase provider
    if (provider === 'supabase') {
      return authServiceSupabase.logout();
    }

    // HTTP provider (default)
    await apiClient.post<void>(`${ENDPOINT}/logout`, {});
  }

  /**
   * Registrar novo usuário
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const provider = getDataProvider();

    // Supabase provider
    if (provider === 'supabase') {
      return authServiceSupabase.register(data);
    }

    // HTTP provider (default)
    return apiClient.post<LoginResponse>(`${ENDPOINT}/register`, data);
  }

  /**
   * Validar token
   */
  async validateToken(token: string): Promise<User> {
    const provider = getDataProvider();

    // Supabase provider - get current user instead of validating token
    if (provider === 'supabase') {
      const user = await authServiceSupabase.getCurrentUser();
      if (!user) {
        throw new Error('Invalid or expired token');
      }
      return user;
    }

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

    // Supabase provider
    if (provider === 'supabase') {
      return authServiceSupabase.getCurrentUser();
    }

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

    // Supabase provider - not implemented yet
    if (provider === 'supabase') {
      throw new Error('Change password not implemented for Supabase provider');
    }

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
