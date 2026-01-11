/**
 * Data Provider Configuration and Resolution
 *
 * This module handles Nhost configuration and validation.
 *
 * Default: nhost
 */

export type DataProvider = 'nhost';

/**
 * Resolves the current data provider (always Nhost).
 */
export function getDataProvider(): DataProvider {
  return 'nhost';
}

/**
 * Helper function for provider detection
 */
export function isNhostProvider(): boolean {
  return true;
}

/**
 * Get provider configuration summary (for logging/debugging)
 */
export function getProviderConfig() {
  const config = {
    provider: 'nhost' as const,
    isNhost: true,
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
    console.info('[Provider] NHOST MODE', config);
  }

  return config;
}