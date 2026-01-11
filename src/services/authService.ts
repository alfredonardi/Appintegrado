/**
 * Service para Autenticação
 * Usa exclusivamente Nhost como backend
 */

import { authServiceNhost } from './nhost/authServiceNhost';
import { User } from './mock/mockUsers';

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
    const nhostUser = await authServiceNhost.login(email, password);
    const token = authServiceNhost.getAccessToken() || '';

    // Mapear NhostUser para User
    const user: User = {
      id: nhostUser.id,
      name: nhostUser.displayName || nhostUser.email || 'Usuário',
      email: nhostUser.email || '',
      role: nhostUser.defaultRole || 'user',
    };

    return { token, user };
  }

  /**
   * Logout - Limpar sessão
   */
  async logout(): Promise<void> {
    await authServiceNhost.logout();
  }

  /**
   * Registrar novo usuário
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const nhostUser = await authServiceNhost.register(data.email, data.password, data.name);
    const token = authServiceNhost.getAccessToken() || '';

    // Mapear NhostUser para User
    const user: User = {
      id: nhostUser.id,
      name: nhostUser.displayName || data.name || 'Usuário',
      email: nhostUser.email || data.email,
      role: nhostUser.defaultRole || data.role || 'user',
    };

    return { token, user };
  }

  /**
   * Validar token
   */
  async validateToken(token: string): Promise<User> {
    const nhostUser = authServiceNhost.getCurrentUser();
    if (!nhostUser) {
      throw new Error('Token inválido ou expirado');
    }

    return {
      id: nhostUser.id,
      name: nhostUser.displayName || nhostUser.email || 'Usuário',
      email: nhostUser.email || '',
      role: nhostUser.defaultRole || 'user',
    };
  }

  /**
   * Obter usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    const nhostUser = authServiceNhost.getCurrentUser();
    if (!nhostUser) {
      return null;
    }

    return {
      id: nhostUser.id,
      name: nhostUser.displayName || nhostUser.email || 'Usuário',
      email: nhostUser.email || '',
      role: nhostUser.defaultRole || 'user',
    };
  }

  /**
   * Alterar senha
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    throw new Error('Nhost implementation not yet available for changePassword');
  }
}

/**
 * Instância global do serviço
 */
export const authService = new AuthService();
