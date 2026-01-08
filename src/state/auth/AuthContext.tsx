import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * AuthContext - Autenticação mock com localStorage
 *
 * Mock simples que aceita qualquer email/senha
 * Token salvo em localStorage (fake JWT)
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
  logout: () => void;
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

  // Verificar token ao iniciar (simular session persistence)
  useEffect(() => {
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

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    // Simular delay de login
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock: aceita qualquer email/senha (não vazio)
    if (!email.trim() || !password.trim()) {
      setIsLoading(false);
      throw new Error('Email e senha são obrigatórios');
    }

    // Gerar fake JWT token
    const token = btoa(JSON.stringify({ email, timestamp: Date.now() }));

    // Criar usuário fake
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      role: 'user',
    };

    // Salvar em localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

    // Atualizar estado
    setUser(newUser);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = () => {
    // Remover do localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    // Limpar estado
    setUser(null);
    setIsAuthenticated(false);
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
