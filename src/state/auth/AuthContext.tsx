import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isNhostProvider } from '@/services/provider';
import { initializeNhost, getNhostClientOrThrow } from '@/services/nhost/nhostClient';

/**
 * AuthContext - Nhost authentication only.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'chief' | 'delegate' | 'investigator' | 'photographer';
  // Nhost
  organization_id?: string;
  team_id?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Provider do contexto
 * Envolver a app com este component para habilitar autenticacao
 * Requer Nhost (VITE_DATA_PROVIDER=nhost)
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar provider e restaurar sessao ao montar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!isNhostProvider()) {
          setError('Nhost mode is required. Set VITE_DATA_PROVIDER=nhost.');
          return;
        }

        const envAuthUrl = import.meta.env.VITE_NHOST_AUTH_URL as string | undefined;
        const envGraphqlUrl = import.meta.env.VITE_NHOST_GRAPHQL_URL as string | undefined;
        const envStorageUrl = import.meta.env.VITE_NHOST_STORAGE_URL as string | undefined;
        const envFunctionsUrl = import.meta.env.VITE_NHOST_FUNCTIONS_URL as string | undefined;
        const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN as string | undefined;
        const region = import.meta.env.VITE_NHOST_REGION as string | undefined;

        const authUrl =
          envAuthUrl ||
          (subdomain && region
            ? `https://${subdomain}.auth.${region}.nhost.run/v1`
            : undefined);
        const graphqlUrl =
          envGraphqlUrl ||
          (subdomain && region
            ? `https://${subdomain}.graphql.${region}.nhost.run/v1`
            : undefined);
        const storageUrl =
          envStorageUrl ||
          (subdomain && region
            ? `https://${subdomain}.storage.${region}.nhost.run/v1`
            : undefined);
        const functionsUrl =
          envFunctionsUrl ||
          (subdomain && region
            ? `https://${subdomain}.functions.${region}.nhost.run/v1`
            : undefined);

        if (!authUrl || !graphqlUrl) {
          throw new Error(
            'Nhost URLs nao estao configuradas. Defina VITE_NHOST_AUTH_URL e ' +
              'VITE_NHOST_GRAPHQL_URL (ou VITE_NHOST_SUBDOMAIN + VITE_NHOST_REGION).'
          );
        }

        // Cleanup legacy mock keys to avoid confusion in localStorage.
        localStorage.removeItem('atlas-auth-token');
        localStorage.removeItem('atlas-auth-user');

        try {
          initializeNhost({ authUrl, graphqlUrl, storageUrl, functionsUrl });
          const client = getNhostClientOrThrow();
          const nhostUser = client.getUser();

          if (nhostUser && client.isAuthenticated()) {
            const appUser: User = {
              id: nhostUser.id,
              email: nhostUser.email,
              name: nhostUser.name || nhostUser.email.split('@')[0],
              role: nhostUser.role,
              organization_id: nhostUser.organization_id,
              team_id: nhostUser.team_id,
            };

            setUser(appUser);
            setIsAuthenticated(true);
          }
        } catch (nhostError) {
          console.warn('[Auth] Failed to initialize Nhost:', nhostError);
          setError('Falha ao conectar com Nhost. Verifique as configuracoes.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Email e senha sao obrigatorios');
      }

      if (!isNhostProvider()) {
        throw new Error('Nhost mode is required. Set VITE_DATA_PROVIDER=nhost.');
      }

      try {
        const client = getNhostClientOrThrow();
        const session = await client.signIn(email, password);

        const newUser: User = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || email.split('@')[0],
          role: session.user.role,
          organization_id: session.user.organization_id,
          team_id: session.user.team_id,
        };

        setUser(newUser);
        setIsAuthenticated(true);
      } catch (nhostError) {
        throw new Error(
          `Falha ao fazer login via Nhost: ${
            nhostError instanceof Error ? nhostError.message : 'Erro desconhecido'
          }`
        );
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!isNhostProvider()) {
        throw new Error('Nhost mode is required. Set VITE_DATA_PROVIDER=nhost.');
      }

      try {
        const client = getNhostClientOrThrow();
        await client.signOut();
      } catch (err) {
        console.warn('[Auth] Nhost logout error:', err);
      }

      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('[Auth] Logout error:', err);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth - Hook para usar autenticacao
 * Use em qualquer componente dentro de AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}