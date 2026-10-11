import { IShoppingService } from './types';
import {
  ShoppingItem,
  CreateShoppingItemDTO,
  UpdateShoppingItemDTO,
  Family,
  User,
  Category,
} from '../types/shopping';
import { supabase } from './supabaseClient';
import { resolveUserColor } from '../utils/formatters';

interface SupabaseShoppingItemRow {
  id: string;
  family_id: string;
  created_by: string | null;
  name: string;
  category: string;
  quantity: number | string;
  unit: string | null;
  notes: string | null;
  completed: boolean;
  completed_by: string | null;
  completed_at: string | null;
  viewed_by: string[] | Record<string, unknown> | null;
  created_at: string;
}

interface SupabaseUserRow {
  id: string;
  family_id: string;
  name: string;
  avatar: string | null;
  color: string | null;
  created_at?: string;
}

interface SupabaseFamilyRow {
  id: string;
  name: string;
  created_at?: string;
}

/**
 * Converte um registo da tabela shopping_items para o modelo ShoppingItem da app
 */
function mapRowToShoppingItem(row: SupabaseShoppingItemRow): ShoppingItem {
  let viewedByList: string[] = [];
  if (Array.isArray(row.viewed_by)) {
    viewedByList = row.viewed_by;
  }

  return {
    id: row.id,
    familyId: row.family_id,
    name: row.name,
    quantity: Number(row.quantity) || 1,
    unit: row.unit || 'un',
    category: row.category as Category,
    createdBy: row.created_by || '',
    createdAt: row.created_at,
    isPurchased: Boolean(row.completed),
    purchasedBy: row.completed_by || null,
    purchasedAt: row.completed_at || null,
    notes: row.notes || undefined,
    viewedBy: viewedByList,
  };
}

/**
 * Converte um registo da tabela users para o modelo User da app
 */
function mapRowToUser(row: SupabaseUserRow): User {
  return {
    id: row.id,
    familyId: row.family_id,
    name: row.name,
    avatar: row.avatar || row.name.charAt(0).toUpperCase(),
    color: row.color || 'green',
    avatarColor: resolveUserColor(row.color || 'green'),
  };
}

/**
 * Serviço de Compras ligado à base de dados real do Supabase.
 */
export class SupabaseShoppingService implements IShoppingService {
  /**
   * Obtém a família ativa pelo nome (ex: "Home") ou por ID.
   */
  async getFamily(familyIdOrName: string): Promise<Family | null> {
    // 1. Tentar procurar por nome (ex: "Home")
    const { data: byNameData, error: byNameError } = await supabase
      .from('families')
      .select('id, name')
      .eq('name', familyIdOrName)
      .maybeSingle<SupabaseFamilyRow>();

    if (byNameData && !byNameError) {
      return { id: byNameData.id, name: byNameData.name };
    }

    // 2. Tentar procurar por ID
    const { data: byIdData, error: byIdError } = await supabase
      .from('families')
      .select('id, name')
      .eq('id', familyIdOrName)
      .maybeSingle<SupabaseFamilyRow>();

    if (byIdData && !byIdError) {
      return { id: byIdData.id, name: byIdData.name };
    }

    // 3. Fallback: obter a primeira família disponível na base de dados
    const { data: firstFamily, error: firstError } = await supabase
      .from('families')
      .select('id, name')
      .limit(1)
      .maybeSingle<SupabaseFamilyRow>();

    if (firstFamily && !firstError) {
      return { id: firstFamily.id, name: firstFamily.name };
    }

    return null;
  }

  /**
   * Obtém todos os utilizadores da família da tabela 'users'.
   * Lê: id, name, avatar e color.
   */
  async getFamilyUsers(familyId: string): Promise<User[]> {
    let query = supabase
      .from('users')
      .select('id, family_id, name, avatar, color, created_at')
      .order('created_at', { ascending: true });

    if (familyId) {
      query = query.eq('family_id', familyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao ler utilizadores do Supabase:', error);
      // Fallback sem filtro de family_id caso haja desfasamento
      const { data: fallbackData } = await supabase
        .from('users')
        .select('id, family_id, name, avatar, color');
      return (fallbackData || []).map(mapRowToUser);
    }

    return (data || []).map(mapRowToUser);
  }

  /**
   * Obtém todos os artigos da tabela 'shopping_items' para a família.
   */
  async getItems(familyId: string): Promise<ShoppingItem[]> {
    if (!familyId) return [];

    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao ler artigos do Supabase:', error);
      return [];
    }

    return (data || []).map(mapRowToShoppingItem);
  }

  /**
   * Adiciona um novo artigo à tabela 'shopping_items' no Supabase.
   */
  async addItem(itemDTO: CreateShoppingItemDTO): Promise<ShoppingItem> {
    const payload = {
      family_id: itemDTO.familyId,
      created_by: itemDTO.createdBy || null,
      name: itemDTO.name.trim(),
      category: itemDTO.category,
      quantity: Number(itemDTO.quantity) || 1,
      unit: itemDTO.unit || 'un',
      notes: itemDTO.notes?.trim() || null,
      completed: false,
      completed_by: null,
      completed_at: null,
      viewed_by: itemDTO.createdBy ? [itemDTO.createdBy] : [],
    };

    const { data, error } = await supabase
      .from('shopping_items')
      .insert(payload)
      .select()
      .single<SupabaseShoppingItemRow>();

    if (error || !data) {
      console.error('Erro ao adicionar artigo no Supabase:', error);
      throw new Error(error?.message || 'Falha ao adicionar artigo no Supabase');
    }

    return mapRowToShoppingItem(data);
  }

  /**
   * Alterna o estado de compra (completed) de um artigo no Supabase.
   */
  async togglePurchased(
    id: string,
    isPurchased: boolean,
    userId: string
  ): Promise<ShoppingItem> {
    const updatePayload = {
      completed: isPurchased,
      completed_by: isPurchased ? userId : null,
      completed_at: isPurchased ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('shopping_items')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single<SupabaseShoppingItemRow>();

    if (error || !data) {
      console.error('Erro ao alternar estado do artigo no Supabase:', error);
      throw new Error(error?.message || 'Falha ao atualizar estado no Supabase');
    }

    return mapRowToShoppingItem(data);
  }

  /**
   * Atualiza campos de um artigo no Supabase.
   */
  async updateItem(
    id: string,
    updates: UpdateShoppingItemDTO
  ): Promise<ShoppingItem> {
    const updatePayload: Record<string, unknown> = {};

    if (updates.name !== undefined) updatePayload.name = updates.name.trim();
    if (updates.quantity !== undefined)
      updatePayload.quantity = Number(updates.quantity) || 1;
    if (updates.unit !== undefined) updatePayload.unit = updates.unit;
    if (updates.category !== undefined) updatePayload.category = updates.category;
    if (updates.notes !== undefined)
      updatePayload.notes = updates.notes?.trim() || null;

    const { data, error } = await supabase
      .from('shopping_items')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single<SupabaseShoppingItemRow>();

    if (error || !data) {
      console.error('Erro ao atualizar artigo no Supabase:', error);
      throw new Error(error?.message || 'Falha ao atualizar artigo no Supabase');
    }

    return mapRowToShoppingItem(data);
  }

  /**
   * Elimina um artigo da tabela 'shopping_items' no Supabase.
   */
  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao eliminar artigo no Supabase:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Elimina todos os artigos comprados (completed = true) da família.
   */
  async clearPurchased(familyId: string): Promise<void> {
    if (!familyId) return;

    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('family_id', familyId)
      .eq('completed', true);

    if (error) {
      console.error('Erro ao limpar artigos comprados no Supabase:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Operação não aplicável no Supabase (não utiliza dados mock).
   */
  async resetToMockData(): Promise<void> {
    console.info('[SupabaseShoppingService] A utilizar base de dados real do Supabase.');
  }
}
