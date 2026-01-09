/**
 * Photo Report Service - Supabase Implementation
 * Sincroniza com tabela photo_report_items no Supabase
 */

import { initSupabaseClient } from './supabaseClient';
import { PhotoReportItem } from '@/types/photoReport';

/**
 * Listar todos os itens do relatório de um caso
 * SELECT * FROM photo_report_items WHERE caseId = $1 ORDER BY order ASC
 */
export async function listPhotoReport(caseId: string): Promise<PhotoReportItem[]> {
  const supabase = await initSupabaseClient();
  const { data, error } = await supabase
    .from('photo_report_items')
    .select('*')
    .eq('caseId', caseId)
    .order('order', { ascending: true });

  if (error) {
    console.error('[PhotoReportServiceSupabase] Erro ao listar itens:', error);
    throw error;
  }

  return data || [];
}

/**
 * Adicionar uma imagem ao relatório
 * INSERT INTO photo_report_items (id, caseId, imageId, caption, order, createdAt)
 */
export async function addPhotoReportItem(caseId: string, imageId: string): Promise<PhotoReportItem> {
  const supabase = await initSupabaseClient();

  // Primeiro, obtém o número total de itens para definir a ordem
  const { data: existingItems, error: listError } = await supabase
    .from('photo_report_items')
    .select('id')
    .eq('caseId', caseId);

  if (listError) {
    console.error('[PhotoReportServiceSupabase] Erro ao contar itens:', listError);
    throw listError;
  }

  const order = (existingItems?.length || 0);

  // Verifica duplicata
  const { data: duplicateCheck } = await supabase
    .from('photo_report_items')
    .select('id')
    .eq('caseId', caseId)
    .eq('imageId', imageId);

  if (duplicateCheck && duplicateCheck.length > 0) {
    throw new Error('Imagem já está no relatório');
  }

  // Insere novo item
  const newItem: PhotoReportItem = {
    id: crypto.randomUUID(),
    caseId,
    imageId,
    caption: '',
    order,
    createdAt: new Date().toISOString(),
  };

  const { error: insertError } = await supabase
    .from('photo_report_items')
    .insert([newItem]);

  if (insertError) {
    console.error('[PhotoReportServiceSupabase] Erro ao inserir item:', insertError);
    throw insertError;
  }

  return newItem;
}

/**
 * Atualizar um item (caption, etc)
 * UPDATE photo_report_items SET ... WHERE id = $1 AND caseId = $2
 */
export async function updatePhotoReportItem(
  caseId: string,
  itemId: string,
  patch: Partial<Omit<PhotoReportItem, 'id' | 'caseId' | 'imageId'>>
): Promise<PhotoReportItem> {
  const supabase = await initSupabaseClient();

  const { data, error } = await supabase
    .from('photo_report_items')
    .update(patch)
    .eq('id', itemId)
    .eq('caseId', caseId)
    .select()
    .single();

  if (error) {
    console.error('[PhotoReportServiceSupabase] Erro ao atualizar item:', error);
    throw error;
  }

  return data as PhotoReportItem;
}

/**
 * Remover um item
 * DELETE FROM photo_report_items WHERE id = $1 AND caseId = $2
 */
export async function removePhotoReportItem(caseId: string, itemId: string): Promise<void> {
  const supabase = await initSupabaseClient();

  const { error } = await supabase
    .from('photo_report_items')
    .delete()
    .eq('id', itemId)
    .eq('caseId', caseId);

  if (error) {
    console.error('[PhotoReportServiceSupabase] Erro ao remover item:', error);
    throw error;
  }
}

/**
 * Reordenar itens
 * Atualiza o campo 'order' para cada item baseado na nova sequência
 */
export async function reorderPhotoReportItems(caseId: string, orderedIds: string[]): Promise<void> {
  const supabase = await initSupabaseClient();

  // Busca itens para validar
  const { data: items, error: fetchError } = await supabase
    .from('photo_report_items')
    .select('*')
    .eq('caseId', caseId);

  if (fetchError) {
    console.error('[PhotoReportServiceSupabase] Erro ao buscar itens:', fetchError);
    throw fetchError;
  }

  // Constrói updates
  const updates = orderedIds.map((id, index) => ({
    id,
    caseId,
    order: index,
  }));

  // Aplica updates em batch (via RPC ou individual)
  // Para simplicidade, fazemos updates individuais
  for (const update of updates) {
    const { error: updateError } = await supabase
      .from('photo_report_items')
      .update({ order: update.order })
      .eq('id', update.id)
      .eq('caseId', caseId);

    if (updateError) {
      console.error('[PhotoReportServiceSupabase] Erro ao reordenar item:', updateError);
      throw updateError;
    }
  }
}
