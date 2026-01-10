import { isMockProvider } from './provider';

/**
 * API Client - centraliza chamadas HTTP
 */

export interface ApiClientConfig {
  baseURL: string;
  useMock: boolean;
  timeout?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

/**
 * Configuracao inicial do cliente
 */
const config: ApiClientConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  useMock: isMockProvider(),
  timeout: 30000,
};

/**
 * Client HTTP generico
 */
export class ApiClient {
  private baseURL: string;
  private useMock: boolean;
  private timeout: number;

  constructor(cfg: ApiClientConfig) {
    this.baseURL = cfg.baseURL;
    this.useMock = cfg.useMock;
    this.timeout = cfg.timeout || 30000;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>('POST', endpoint, body, options);
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * Request generico
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    if (this.useMock) {
      throw new Error('HTTP client disabled while data provider is mock.');
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    const authToken =
      localStorage.getItem('nhost-auth-token') || localStorage.getItem('casehub-auth-token');
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = {
          status: response.status,
          message: response.statusText,
        };

        try {
          error.data = await response.json();
        } catch {
          // Keep error as-is if JSON parse fails
        }

        throw error;
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw {
        status: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiError;
    }
  }

  /**
   * Verificar se esta em modo mock
   */
  isMockMode(): boolean {
    return this.useMock;
  }

  /**
   * Obter config atual
   */
  getConfig(): ApiClientConfig {
    return { baseURL: this.baseURL, useMock: this.useMock };
  }
}

/**
 * Instancia global do cliente
 */
export const apiClient = new ApiClient(config);

/**
 * Log de configuracao em dev mode
 */
if (import.meta.env.DEV) {
  console.log('[API] HTTP client configured', {
    baseURL: config.baseURL,
    enabled: !config.useMock,
  });
}