/**
 * Supabase Client Configuration and Initialization
 *
 * This module initializes and exports a Supabase client for database and storage operations.
 *
 * Required environment variables:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key
 *
 * Installation:
 * npm install @supabase/supabase-js
 */

type SupabaseClient = any; // Will be properly typed when @supabase/supabase-js is installed

let supabaseClient: SupabaseClient | null = null;
let initPromise: Promise<SupabaseClient> | null = null;

/**
 * Initialize and return Supabase client
 * Lazily loads the client only when needed using dynamic import
 */
export async function initSupabaseClient(): Promise<SupabaseClient> {
  if (supabaseClient) {
    return supabaseClient;
  }

  // Prevent multiple initialization attempts in parallel
  if (initPromise) {
    return initPromise;
  }

  initPromise = performInitialization();
  return initPromise;
}

async function performInitialization(): Promise<SupabaseClient> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      '[Supabase] Missing environment variables. ' +
      'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    );
    throw new Error(
      'Supabase is not properly configured. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }

  try {
    // Dynamically import createClient to avoid breaking if @supabase/supabase-js is not installed
    // This uses dynamic import() which won't be analyzed by Vite's dependency scanner
    const module = await import('@supabase/supabase-js');
    const createClient = module.createClient;

    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    if (import.meta.env.DEV) {
      console.info('[Supabase] Client initialized successfully');
    }

    return supabaseClient;
  } catch (error) {
    console.error('[Supabase] Failed to initialize client:', error);
    initPromise = null; // Reset so it can retry
    throw new Error(
      'Failed to initialize Supabase client. ' +
      'Make sure @supabase/supabase-js is installed: npm install @supabase/supabase-js'
    );
  }
}

/**
 * Get the initialized Supabase client
 * This is a synchronous accessor for compatibility with existing code
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    // If called synchronously without initialization, throw helpful error
    throw new Error(
      'Supabase client not initialized. Call await initSupabaseClient() first, ' +
      'or ensure VITE_DATA_PROVIDER=supabase with proper environment variables.'
    );
  }
  return supabaseClient;
}

/**
 * Check if Supabase client is available and configured
 */
export function isSupabaseConfigured(): boolean {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
}

/**
 * Reset client (useful for testing)
 */
export function resetSupabaseClient(): void {
  supabaseClient = null;
  initPromise = null;
}
