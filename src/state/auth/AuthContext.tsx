import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../../services/authService';
import { isSupabaseProvider } from '../../services/provider';
import * as authServiceSupabase from '../../services/supabase/authServiceSupabase';

/**
 * AuthContext - Autenticação com suporte a Mock e Supabase
 *
 * Mock: simples que aceita qualquer email/senha, token salvo em localStorage (fake JWT)
 * Supabase: integra com supabase.auth, persiste sessão automaticamente
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Chave para localStorage
const AUTH_TOKEN_KEY = 'casehub-auth-token';
const AUTH_USER_KEY = 'casehub-auth-user';

/**
 * AuthProvider - Provider do contexto
 * Envolver a app com este component para habilitar autenticação
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Recuperar sessão ao iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Se Supabase, obter sessão e setup listener
        if (isSupabaseProvider()) {
          // Obter sessão atual
          const session = await authServiceSupabase.getSession();
          if (session?.user) {
            const currentUser = await authServiceSupabase.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              setIsAuthenticated(true);
            }
          }

          // Setup listener para mudanças de auth state
          authServiceSupabase.onAuthStateChange((authUser) => {
            if (authUser) {
              setUser(authUser);
              setIsAuthenticated(true);
            } else {
              setUser(null);
              setIsAuthenticated(false);
            }
          });
        } else {
          // Mock ou HTTP: tentar restaurar do localStorage
          const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
          const storedUser = localStorage.getItem(AUTH_USER_KEY);

          if (storedToken && storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setIsAuthenticated(true);
            } catch (error) {
              console.error('Erro ao restaurar sessão:', error);
              localStorage.removeItem(AUTH_TOKEN_KEY);
              localStorage.removeItem(AUTH_USER_KEY);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Em modo mock, simular delay
      if (!isSupabaseProvider()) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Validação básica
      if (!email.trim() || !password.trim()) {
        throw new Error('Email e senha são obrigatórios');
      }

      // Usar authService para rotear pelo provider
      const response = await authService.login(email, password);

      // Atualizar estado
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();

      // Limpar estado
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Limpar mesmo com erro
      setUser(null);
      setIsAuthenticated(false);
      throw error;
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
