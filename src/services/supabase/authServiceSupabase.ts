/**
 * Auth Service - Supabase Implementation
 *
 * This module provides authentication operations using Supabase Auth.
 * Supports email/password registration and login with session persistence.
 */

import { User } from '../mock/mockUsers';
import { initSupabaseClient } from './supabaseClient';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

/**
 * Map Supabase user metadata to our User type
 */
function mapSupabaseUserToAppUser(supabaseUser: any): User {
  const metadata = supabaseUser.user_metadata || {};
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: metadata.name || supabaseUser.email?.split('@')[0] || 'Usuario',
    role: metadata.role || 'Investigador',
    status: 'ativo',
    badge: metadata.badge,
    createdAt: supabaseUser.created_at || new Date().toISOString(),
    updatedAt: supabaseUser.updated_at || new Date().toISOString(),
  };
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const supabase = await initSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[AuthServiceSupabase] Login error:', error.message);
      throw new Error(error.message || 'Failed to login');
    }

    if (!data.session || !data.user) {
      throw new Error('No session or user data returned');
    }

    const user = mapSupabaseUserToAppUser(data.user);
    const token = data.session.access_token;

    // Store token in localStorage for compatibility with existing code
    localStorage.setItem('casehub-auth-token', token);
    localStorage.setItem('casehub-auth-user', JSON.stringify(user));

    return { token, user };
  } catch (error) {
    console.error('[AuthServiceSupabase] Unexpected error in login:', error);
    throw error;
  }
}

/**
 * Register new user with email and password
 */
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  try {
    if (!data.email || !data.password || !data.name) {
      throw new Error('Name, email, and password are required');
    }

    const supabase = await initSupabaseClient();

    // Sign up user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role || 'Investigador',
        },
      },
    });

    if (signUpError) {
      console.error('[AuthServiceSupabase] Registration error:', signUpError.message);
      throw new Error(signUpError.message || 'Failed to register');
    }

    if (!signUpData.user) {
      throw new Error('No user data returned from registration');
    }

    // Map user data
    const user = mapSupabaseUserToAppUser(signUpData.user);

    // If session exists (email confirmation might be required), use access token
    let token = '';
    if (signUpData.session?.access_token) {
      token = signUpData.session.access_token;
      localStorage.setItem('casehub-auth-token', token);
    }

    localStorage.setItem('casehub-auth-user', JSON.stringify(user));

    return { token, user };
  } catch (error) {
    console.error('[AuthServiceSupabase] Unexpected error in register:', error);
    throw error;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const supabase = await initSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[AuthServiceSupabase] Logout error:', error.message);
      throw new Error(error.message || 'Failed to logout');
    }

    // Clear local storage
    localStorage.removeItem('casehub-auth-token');
    localStorage.removeItem('casehub-auth-user');
  } catch (error) {
    console.error('[AuthServiceSupabase] Unexpected error in logout:', error);
    throw error;
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const supabase = await initSupabaseClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('[AuthServiceSupabase] Get session error:', error.message);
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('[AuthServiceSupabase] Unexpected error in getSession:', error);
    return null;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  try {
    initSupabaseClient().then((supabase) => {
      supabase.auth.onAuthStateChange((_event: string, session: any) => {
        if (session?.user) {
          const user = mapSupabaseUserToAppUser(session.user);
          localStorage.setItem('casehub-auth-token', session.access_token);
          localStorage.setItem('casehub-auth-user', JSON.stringify(user));
          callback(user);
        } else {
          localStorage.removeItem('casehub-auth-token');
          localStorage.removeItem('casehub-auth-user');
          callback(null);
        }
      });
    });
  } catch (error) {
    console.error('[AuthServiceSupabase] Error setting up auth state listener:', error);
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await initSupabaseClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      // Try to get from localStorage as fallback
      const storedUser = localStorage.getItem('casehub-auth-user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {
          return null;
        }
      }
      return null;
    }

    return mapSupabaseUserToAppUser(data.user);
  } catch (error) {
    console.error('[AuthServiceSupabase] Error getting current user:', error);
    return null;
  }
}
