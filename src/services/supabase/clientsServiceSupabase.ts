/**
 * Clients Service - Supabase Implementation
 *
 * This module provides client management operations using Supabase as the data provider.
 * It implements the same interface as clientsService to ensure seamless provider switching.
 */

import { Client, createEmptyClient } from '@/types/client';
import { initSupabaseClient } from './supabaseClient';

const TABLE_NAME = 'clients';

/**
 * Fetch all clients from Supabase
 */
export async function getClients(): Promise<Client[]> {
  try {
    const supabase = await initSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('[ClientsServiceSupabase] Error fetching clients:', error.message);
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    return (data || []) as Client[];
  } catch (error) {
    console.error('[ClientsServiceSupabase] Unexpected error in getClients:', error);
    throw error;
  }
}

/**
 * Fetch a specific client by ID
 */
export async function getClientById(id: string): Promise<Client> {
  try {
    const supabase = await initSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found error
        throw new Error(`Client with ID ${id} not found`);
      }
      console.error('[ClientsServiceSupabase] Error fetching client:', error.message);
      throw new Error(`Failed to fetch client: ${error.message}`);
    }

    return data as Client;
  } catch (error) {
    console.error('[ClientsServiceSupabase] Unexpected error in getClientById:', error);
    throw error;
  }
}

/**
 * Create a new client
 */
export async function createClient(
  data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Client> {
  try {
    const supabase = await initSupabaseClient();
    const id = `client-${Date.now()}`;
    const newClient: Client = {
      ...createEmptyClient(id),
      ...data,
    };

    const { data: createdClient, error } = await supabase
      .from(TABLE_NAME)
      .insert([newClient])
      .select()
      .single();

    if (error) {
      console.error('[ClientsServiceSupabase] Error creating client:', error.message);
      throw new Error(`Failed to create client: ${error.message}`);
    }

    return createdClient as Client;
  } catch (error) {
    console.error('[ClientsServiceSupabase] Unexpected error in createClient:', error);
    throw error;
  }
}

/**
 * Update a client with partial updates
 */
export async function updateClient(
  id: string,
  updates: Partial<Client>
): Promise<Client> {
  try {
    const supabase = await initSupabaseClient();

    // Ensure updatedAt is always refreshed
    const clientUpdates = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(clientUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[ClientsServiceSupabase] Error updating client:', error.message);
      throw new Error(`Failed to update client: ${error.message}`);
    }

    return data as Client;
  } catch (error) {
    console.error('[ClientsServiceSupabase] Unexpected error in updateClient:', error);
    throw error;
  }
}

/**
 * Delete a client by ID
 */
export async function deleteClient(id: string): Promise<void> {
  try {
    const supabase = await initSupabaseClient();
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[ClientsServiceSupabase] Error deleting client:', error.message);
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  } catch (error) {
    console.error('[ClientsServiceSupabase] Unexpected error in deleteClient:', error);
    throw error;
  }
}

/**
 * Fetch clients filtered by status
 */
export async function getClientsByStatus(
  status: 'ativo' | 'inativo' | 'bloqueado'
): Promise<Client[]> {
  try {
    const supabase = await initSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('status', status)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('[ClientsServiceSupabase] Error fetching clients by status:', error.message);
      throw new Error(`Failed to fetch clients by status: ${error.message}`);
    }

    return (data || []) as Client[];
  } catch (error) {
    console.error('[ClientsServiceSupabase] Unexpected error in getClientsByStatus:', error);
    throw error;
  }
}

/**
 * Fetch a client by email
 */
export async function getClientByEmail(email: string): Promise<Client | null> {
  try {
    const supabase = await initSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('[ClientsServiceSupabase] Error fetching client by email:', error.message);
      throw new Error(`Failed to fetch client by email: ${error.message}`);
    }

    return (data as Client) || null;
  } catch (error) {
    console.error('[ClientsServiceSupabase] Unexpected error in getClientByEmail:', error);
    throw error;
  }
}

/**
 * Fetch a client by document (CPF/CNPJ)
 */
export async function getClientByDocument(document: string): Promise<Client | null> {
  try {
    const supabase = await initSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('document', document)
      .maybeSingle();

    if (error) {
      console.error('[ClientsServiceSupabase] Error fetching client by document:', error.message);
      throw new Error(`Failed to fetch client by document: ${error.message}`);
    }

    return (data as Client) || null;
  } catch (error) {
    console.error('[ClientsServiceSupabase] Unexpected error in getClientByDocument:', error);
    throw error;
  }
}
