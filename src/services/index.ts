import { IShoppingService } from './types';
import { LocalShoppingService } from './localShoppingService';
import { SupabaseShoppingService } from './supabaseShoppingService';
import { isSupabaseConfigured } from './supabaseClient';

/**
 * Fábrica do serviço de compras:
 * Seleciona automaticamente o SupabaseShoppingService se as variáveis de ambiente existirem,
 * ou o LocalShoppingService (localStorage) por defeito.
 */
function createShoppingService(): IShoppingService {
  if (isSupabaseConfigured()) {
    console.info('[AppSupermercado] A utilizar o serviço de dados Supabase.');
    return new SupabaseShoppingService();
  }

  // Por defeito no MVP V1: LocalStorage com dados simulados
  return new LocalShoppingService();
}

export const shoppingService: IShoppingService = createShoppingService();

export * from './types';
export * from './mockData';
export * from './localShoppingService';
export * from './supabaseShoppingService';
export * from './supabaseClient';
