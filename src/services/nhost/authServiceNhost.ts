/**
 * Auth Service para Nhost
 * Integra Nhost Auth com o AuthContext da aplicação
 */

import { getNhostClientOrThrow } from './nhostClient';
import { NhostUser } from '@/types/organization';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export class AuthServiceNhost {
  /**
   * Login com email e senha
   */
  async login(email: string, password: string): Promise<NhostUser> {
    try {
      const client = getNhostClientOrThrow();
      const session = await client.signIn(email, password);
      return session.user;
    } catch (error) {
      console.error('[Nhost Auth] Login failed:', error);
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Registrar novo usuário
   */
  async register(email: string, password: string, name?: string): Promise<NhostUser> {
    try {
      const client = getNhostClientOrThrow();
      const session = await client.signUp(email, password, name);
      return session.user;
    } catch (error) {
      console.error('[Nhost Auth] Registration failed:', error);
      throw new Error(
        `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Fazer logout
   */
  async logout(): Promise<void> {
    try {
      const client = getNhostClientOrThrow();
      await client.signOut();
    } catch (error) {
      console.error('[Nhost Auth] Logout failed:', error);
      throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obter usuário atual
   */
  getCurrentUser(): NhostUser | null {
    try {
      const client = getNhostClientOrThrow();
      return client.getUser();
    } catch {
      return null;
    }
  }

  /**
   * Verificar se está autenticado
   */
  isAuthenticated(): boolean {
    try {
      const client = getNhostClientOrThrow();
      return client.isAuthenticated();
    } catch {
      return false;
    }
  }

  /**
   * Obter token de acesso
   */
  getAccessToken(): string | null {
    try {
      const client = getNhostClientOrThrow();
      return client.getAccessToken();
    } catch {
      return null;
    }
  }
}

/**
 * Instância global do serviço
 */
export const authServiceNhost = new AuthServiceNhost();
