/**
 * Service para Autenticação
 * Abstrai chamadas para API, mock data, ou Supabase baseado no data provider
 */

import { apiClient } from './apiClient';
import { getMockUserByEmail, User } from './mock/mockUsers';
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

    // Mock provider
    if (provider === 'mock') {
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

    // Mock provider
    if (provider === 'mock') {
      console.log('Mock: logout');
      return;
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

    // Mock provider
    if (provider === 'mock') {
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

    // Mock provider
    if (provider === 'mock') {
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

    // Mock and HTTP provider
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

    // Mock provider
    if (provider === 'mock') {
      console.log('Mock: change password');
      return;
    }

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
