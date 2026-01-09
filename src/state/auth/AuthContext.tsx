import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isNhostProvider } from '@/services/provider';
import { initializeNhost, getNhostClientOrThrow } from '@/services/nhost/nhostClient';
import { NhostUser } from '@/types/organization';

/**
 * AuthContext - Suporta autenticação mock e Nhost
 *
 * Mock: aceita qualquer email/senha, token salvo em localStorage
 * Nhost: integra com Nhost Auth, via GraphQL/API
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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Chave para localStorage
const AUTH_TOKEN_KEY = 'casehub-auth-token';
const AUTH_USER_KEY = 'casehub-auth-user';

/**
 * AuthProvider - Provider do contexto
 * Envolver a app com este component para habilitar autenticação
 * Suporta mock e Nhost baseado em VITE_DATA_PROVIDER
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar provider e restaurar sessão ao montar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isNhost = isNhostProvider();

        if (isNhost) {
          // Inicializar Nhost client
          const backendUrl = import.meta.env.VITE_NHOST_BACKEND_URL;
          if (!backendUrl) {
            throw new Error(
              'VITE_NHOST_BACKEND_URL não está configurado. ' +
                'Configure as variáveis de ambiente para Nhost.'
            );
          }

          try {
            initializeNhost({ backendUrl });
            const client = getNhostClientOrThrow();
            const nhostUser = client.getUser();

            if (nhostUser && client.isAuthenticated()) {
              // Converter NhostUser para User
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
            setError(
              'Falha ao conectar com Nhost. Verifique as configurações.'
            );
          }
        } else {
          // Mock mode: restaurar session do localStorage
          const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
          const storedUser = localStorage.getItem(AUTH_USER_KEY);

          if (storedToken && storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setIsAuthenticated(true);
            } catch (parseError) {
              console.error('Erro ao restaurar sessão:', parseError);
              localStorage.removeItem(AUTH_TOKEN_KEY);
              localStorage.removeItem(AUTH_USER_KEY);
            }
          }
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
      // Validações básicas
      if (!email.trim() || !password.trim()) {
        throw new Error('Email e senha são obrigatórios');
      }

      const isNhost = isNhostProvider();

      if (isNhost) {
        // Nhost authentication
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
      } else {
        // Mock authentication
        // Simular delay de login
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Gerar fake JWT token
        const token = btoa(JSON.stringify({ email, timestamp: Date.now() }));

        // Criar usuário mock
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          role: 'investigator',
        };

        // Salvar em localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

        // Atualizar estado
        setUser(newUser);
        setIsAuthenticated(true);
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
      const isNhost = isNhostProvider();

      if (isNhost) {
        // Nhost logout
        try {
          const client = getNhostClientOrThrow();
          await client.signOut();
        } catch (err) {
          console.warn('[Auth] Nhost logout error:', err);
          // Continue com logout local mesmo se Nhost falhar
        }
      }

      // Remover do localStorage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);

      // Limpar estado
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
 * useAuth - Hook para usar autenticação
 * Use em qualquer componente dentro de AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
