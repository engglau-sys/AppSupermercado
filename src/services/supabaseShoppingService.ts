import { IShoppingService } from './types';
import {
  ShoppingItem,
  CreateShoppingItemDTO,
  UpdateShoppingItemDTO,
  Family,
  User,
} from '../types/shopping';
import { isSupabaseConfigured } from './supabaseClient';

/**
 * Implementação preparada para integração futura com Supabase (V2).
 * Implementa a mesma interface IShoppingService, permitindo trocar o serviço sem tocar nos componentes ou páginas.
 */
export class SupabaseShoppingService implements IShoppingService {
  constructor() {
    if (!isSupabaseConfigured()) {
      console.warn(
        '[AppSupermercado] Supabase não está configurado no ficheiro .env. Por favor, configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
      );
    }
  }

  async getItems(_familyId: string): Promise<ShoppingItem[]> {
    throw new Error('Supabase ainda não configurado. Utiliza o LocalShoppingService.');
  }

  async addItem(_item: CreateShoppingItemDTO): Promise<ShoppingItem> {
    throw new Error('Supabase ainda não configurado.');
  }

  async togglePurchased(
    _id: string,
    _isPurchased: boolean,
    _userId: string
  ): Promise<ShoppingItem> {
    throw new Error('Supabase ainda não configurado.');
  }

  async updateItem(
    _id: string,
    _updates: UpdateShoppingItemDTO
  ): Promise<ShoppingItem> {
    throw new Error('Supabase ainda não configurado.');
  }

  async deleteItem(_id: string): Promise<void> {
    throw new Error('Supabase ainda não configurado.');
  }

  async clearPurchased(_familyId: string): Promise<void> {
    throw new Error('Supabase ainda não configurado.');
  }

  async getFamily(_familyId: string): Promise<Family | null> {
    throw new Error('Supabase ainda não configurado.');
  }

  async getFamilyUsers(_familyId: string): Promise<User[]> {
    throw new Error('Supabase ainda não configurado.');
  }

  async resetToMockData(): Promise<void> {
    throw new Error('Não aplicável no Supabase.');
  }
}
