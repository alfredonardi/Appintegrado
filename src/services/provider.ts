/**
 * Data Provider Configuration and Resolution
 *
 * This module handles switching between data providers (including Nhost).
 *
 * Priority:
 * 1. VITE_DATA_PROVIDER (explicit provider selection)
 *
 * Default: nhost
 */

export type DataProvider = 'http' | 'supabase' | 'nhost';

/**
 * Resolves the current data provider based on environment variables.
 */
export function getDataProvider(): DataProvider {
  // Check explicit VITE_DATA_PROVIDER first
  const explicitProvider = import.meta.env.VITE_DATA_PROVIDER as DataProvider | undefined;
  if (explicitProvider && ['http', 'supabase', 'nhost'].includes(explicitProvider)) {
    return explicitProvider;
  }

  return 'nhost';
}

/**
 * Helper functions for provider detection
 */
export function isHttpProvider(): boolean {
  return getDataProvider() === 'http';
}

export function isSupabaseProvider(): boolean {
  return getDataProvider() === 'supabase';
}

export function isNhostProvider(): boolean {
  return getDataProvider() === 'nhost';
}

/**
 * Get provider configuration summary (for logging/debugging)
 */
export function getProviderConfig() {
  const provider = getDataProvider();
  const config = {
    provider,
    isHttp: isHttpProvider(),
    isSupabase: isSupabaseProvider(),
    isNhost: isNhostProvider(),
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || undefined,
    supabaseKeyConfigured: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    nhostAuthUrl: import.meta.env.VITE_NHOST_AUTH_URL || undefined,
    nhostGraphqlUrl: import.meta.env.VITE_NHOST_GRAPHQL_URL || undefined,
    nhostStorageUrl: import.meta.env.VITE_NHOST_STORAGE_URL || undefined,
    nhostFunctionsUrl: import.meta.env.VITE_NHOST_FUNCTIONS_URL || undefined,
    nhostSubdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || undefined,
    nhostRegion: import.meta.env.VITE_NHOST_REGION || undefined,
    nhostConfigured:
      !!import.meta.env.VITE_NHOST_AUTH_URL ||
      !!import.meta.env.VITE_NHOST_GRAPHQL_URL ||
      (!!import.meta.env.VITE_NHOST_SUBDOMAIN && !!import.meta.env.VITE_NHOST_REGION),
  };

  // Log config in development
  if (import.meta.env.DEV) {
    if (config.isNhost) {
      console.info('[Provider] NHOST MODE', config);
    } else {
      console.info('[Provider] Data provider configured:', config);
    }
  }

  return config;
}