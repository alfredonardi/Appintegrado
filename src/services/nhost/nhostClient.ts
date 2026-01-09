/**
 * Nhost Client - Gerencia conexão e autenticação com Nhost
 *
 * Funcionalidades:
 * - Inicialização com URL e token
 * - Autenticação via Nhost Auth (sign up, sign in, sign out)
 * - Queries GraphQL via Hasura
 * - Session persistence
 */

import { NhostUser, NhostSession } from '@/types/organization';

const AUTH_TOKEN_KEY = 'nhost-auth-token';
const AUTH_USER_KEY = 'nhost-auth-user';
const REFRESH_TOKEN_KEY = 'nhost-refresh-token';

export interface NhostConfig {
  backendUrl: string; // https://your-project.nhost.app
  region?: string;
}

export class NhostClient {
  private backendUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: NhostUser | null = null;

  constructor(config: NhostConfig) {
    this.backendUrl = config.backendUrl.replace(/\/$/, ''); // Remove trailing slash
    this.restoreSession();
  }

  /**
   * Restaura sessão do localStorage
   */
  private restoreSession() {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (storedToken && storedUser) {
      try {
        this.accessToken = storedToken;
        this.user = JSON.parse(storedUser);
        this.refreshToken = storedRefreshToken || undefined;
      } catch (error) {
        console.error('[Nhost] Erro ao restaurar sessão:', error);
        this.clearSession();
      }
    }
  }

  /**
   * Limpa a sessão
   */
  private clearSession() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Armazena a sessão
   */
  private saveSession(user: NhostUser, accessToken: string, refreshToken?: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken || null;
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Sign up - Registrar novo usuário
   */
  async signUp(email: string, password: string, name?: string): Promise<NhostSession> {
    try {
      const response = await fetch(`${this.backendUrl}/auth/sign-up/email-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          metadata: { displayName: name },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign up');
      }

      const data = await response.json();
      const { session, mfa, error: authError } = data;

      if (authError) {
        throw new Error(authError.message);
      }

      if (!session || !session.accessToken) {
        throw new Error('No session returned from sign up');
      }

      const user: NhostUser = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.metadata?.displayName || name,
        role: 'investigator', // Default role para novos usuários
      };

      this.saveSession(user, session.accessToken, session.refreshToken);

      return {
        user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      };
    } catch (error) {
      console.error('[Nhost] Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in - Fazer login
   */
  async signIn(email: string, password: string): Promise<NhostSession> {
    try {
      const response = await fetch(`${this.backendUrl}/auth/sign-in/email-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign in');
      }

      const data = await response.json();
      const { session, error: authError } = data;

      if (authError) {
        throw new Error(authError.message);
      }

      if (!session || !session.accessToken) {
        throw new Error('No session returned from sign in');
      }

      // Buscar informações adicionais do usuário (organization, team, role)
      const user = await this.getCurrentUserWithOrganization(session.accessToken);

      this.saveSession(user, session.accessToken, session.refreshToken);

      return {
        user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      };
    } catch (error) {
      console.error('[Nhost] Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out - Fazer logout
   */
  async signOut(): Promise<void> {
    try {
      if (this.accessToken) {
        await fetch(`${this.backendUrl}/auth/sign-out`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('[Nhost] Sign out error:', error);
    } finally {
      this.clearSession();
    }
  }

  /**
   * Obtém usuário atual com informações de organização
   */
  private async getCurrentUserWithOrganization(accessToken: string): Promise<NhostUser> {
    const query = `
      query GetCurrentUser {
        authUser {
          id
          email
          metadata
        }
        userOrganizations: users(where: { auth_id: { _eq: $userId } }) {
          id
          email
          organization_id
          team_id
          role
          name
        }
      }
    `;

    try {
      const response = await this.graphQL(query, {}, accessToken);
      const userOrg = response.data?.userOrganizations?.[0];
      const authUser = response.data?.authUser;

      if (!authUser) {
        throw new Error('User not found');
      }

      return {
        id: authUser.id,
        email: authUser.email,
        name: authUser.metadata?.displayName || authUser.email.split('@')[0],
        organization_id: userOrg?.organization_id,
        team_id: userOrg?.team_id,
        role: userOrg?.role || 'investigator',
      };
    } catch (error) {
      // Se falhar, retorna usuário básico
      console.warn('[Nhost] Failed to fetch user organization:', error);
      return {
        id: accessToken.split('.')[0], // Fallback ID
        email: 'unknown@nhost.local',
        role: 'investigator',
      };
    }
  }

  /**
   * GraphQL query/mutation
   */
  async graphQL(
    query: string,
    variables?: Record<string, unknown>,
    token?: string
  ): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token || this.accessToken) {
      headers.Authorization = `Bearer ${token || this.accessToken}`;
    }

    try {
      const response = await fetch(`${this.backendUrl}/graphql`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('[Nhost] GraphQL errors:', data.errors);
        throw new Error(data.errors[0]?.message || 'GraphQL error');
      }

      return data;
    } catch (error) {
      console.error('[Nhost] GraphQL error:', error);
      throw error;
    }
  }

  /**
   * Getters
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  getUser(): NhostUser | null {
    return this.user;
  }

  getSession(): NhostSession | null {
    if (!this.user || !this.accessToken) {
      return null;
    }

    return {
      user: this.user,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken || undefined,
    };
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.user;
  }
}

/**
 * Instância global do cliente Nhost
 * Será inicializada quando provider for 'nhost'
 */
let nhostClient: NhostClient | null = null;

export function initializeNhost(config: NhostConfig): NhostClient {
  nhostClient = new NhostClient(config);
  return nhostClient;
}

export function getNhostClient(): NhostClient | null {
  return nhostClient;
}

export function getNhostClientOrThrow(): NhostClient {
  if (!nhostClient) {
    throw new Error(
      'Nhost client not initialized. Make sure VITE_DATA_PROVIDER=nhost and ' +
        'VITE_NHOST_BACKEND_URL are set.'
    );
  }
  return nhostClient;
}
