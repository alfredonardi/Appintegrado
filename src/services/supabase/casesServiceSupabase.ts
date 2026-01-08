/**
 * Cases Service - Supabase Implementation
 *
 * This module provides case management operations using Supabase as the data provider.
 * It implements the same interface as casesService to ensure seamless provider switching.
 */

import { Case, CaseStatus, createEmptyCase } from '@/types/case';
import { initSupabaseClient } from './supabaseClient';

const TABLE_NAME = 'cases';

/**
 * Fetch all cases from Supabase
 */
export async function getCases(): Promise<Case[]> {
  try {
    const supabase = await initSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('[CasesServiceSupabase] Error fetching cases:', error.message);
      throw new Error(`Failed to fetch cases: ${error.message}`);
    }

    return (data || []) as Case[];
  } catch (error) {
    console.error('[CasesServiceSupabase] Unexpected error in getCases:', error);
    throw error;
  }
}

/**
 * Fetch a specific case by ID
 */
export async function getCaseById(id: string): Promise<Case> {
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
        throw new Error(`Case with ID ${id} not found`);
      }
      console.error('[CasesServiceSupabase] Error fetching case:', error.message);
      throw new Error(`Failed to fetch case: ${error.message}`);
    }

    return data as Case;
  } catch (error) {
    console.error('[CasesServiceSupabase] Unexpected error in getCaseById:', error);
    throw error;
  }
}

/**
 * Create a new case with the given BO number
 */
export async function createCase(bo: string): Promise<Case> {
  try {
    const supabase = await initSupabaseClient();
    const id = `case-${Date.now()}`;
    const newCase = createEmptyCase(id, bo);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newCase])
      .select()
      .single();

    if (error) {
      console.error('[CasesServiceSupabase] Error creating case:', error.message);
      throw new Error(`Failed to create case: ${error.message}`);
    }

    return data as Case;
  } catch (error) {
    console.error('[CasesServiceSupabase] Unexpected error in createCase:', error);
    throw error;
  }
}

/**
 * Update a case with partial updates
 */
export async function updateCase(
  id: string,
  updates: Partial<Case>
): Promise<Case> {
  try {
    const supabase = await initSupabaseClient();

    // Ensure updatedAt is always refreshed
    const caseUpdates = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(caseUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[CasesServiceSupabase] Error updating case:', error.message);
      throw new Error(`Failed to update case: ${error.message}`);
    }

    return data as Case;
  } catch (error) {
    console.error('[CasesServiceSupabase] Unexpected error in updateCase:', error);
    throw error;
  }
}

/**
 * Delete a case by ID
 */
export async function deleteCase(id: string): Promise<void> {
  try {
    const supabase = await initSupabaseClient();
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[CasesServiceSupabase] Error deleting case:', error.message);
      throw new Error(`Failed to delete case: ${error.message}`);
    }
  } catch (error) {
    console.error('[CasesServiceSupabase] Unexpected error in deleteCase:', error);
    throw error;
  }
}

/**
 * Fetch cases filtered by status
 */
export async function getCasesByStatus(
  status: 'rascunho' | 'em_revisao' | 'finalizado'
): Promise<Case[]> {
  try {
    const supabase = await initSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('status', status)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('[CasesServiceSupabase] Error fetching cases by status:', error.message);
      throw new Error(`Failed to fetch cases by status: ${error.message}`);
    }

    return (data || []) as Case[];
  } catch (error) {
    console.error('[CasesServiceSupabase] Unexpected error in getCasesByStatus:', error);
    throw error;
  }
}

/**
 * Update the status of a case
 */
export async function updateCaseStatus(
  id: string,
  status: CaseStatus
): Promise<Case> {
  try {
    return await updateCase(id, { status });
  } catch (error) {
    console.error('[CasesServiceSupabase] Error updating case status:', error);
    throw error;
  }
}
