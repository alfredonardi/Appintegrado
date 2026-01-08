/**
 * Data Provider Configuration and Resolution
 *
 * This module handles switching between mock, HTTP, and Supabase data providers.
 *
 * Priority:
 * 1. VITE_DATA_PROVIDER (explicit provider selection)
 * 2. VITE_USE_MOCK_API (retrocompat: true → mock, false → http)
 *
 * Default: mock mode for safe local development
 */

export type DataProvider = 'mock' | 'http' | 'supabase';

/**
 * Resolves the current data provider based on environment variables
 * with backward compatibility for VITE_USE_MOCK_API
 */
export function getDataProvider(): DataProvider {
  // Check explicit VITE_DATA_PROVIDER first
  const explicitProvider = import.meta.env.VITE_DATA_PROVIDER as DataProvider | undefined;
  if (explicitProvider && ['mock', 'http', 'supabase'].includes(explicitProvider)) {
    return explicitProvider;
  }

  // Fallback: use VITE_USE_MOCK_API for backward compatibility
  // VITE_USE_MOCK_API !== 'false' → true (default to mock)
  const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';
  return useMockApi ? 'mock' : 'http';
}

/**
 * Helper functions for provider detection
 */
export function isMockProvider(): boolean {
  return getDataProvider() === 'mock';
}

export function isHttpProvider(): boolean {
  return getDataProvider() === 'http';
}

export function isSupabaseProvider(): boolean {
  return getDataProvider() === 'supabase';
}

/**
 * Get provider configuration summary (for logging/debugging)
 */
export function getProviderConfig() {
  const provider = getDataProvider();
  const config = {
    provider,
    isMock: isMockProvider(),
    isHttp: isHttpProvider(),
    isSupabase: isSupabaseProvider(),
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || undefined,
    supabaseKeyConfigured: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  // Log config in development
  if (import.meta.env.DEV) {
    console.info('[Provider] Data provider configured:', config);
  }

  return config;
}
