import { IShoppingService } from './types';
import { SupabaseShoppingService } from './supabaseShoppingService';

/**
 * Serviço de dados oficial da aplicação AppSupermercado:
 * Totalmente ligado à base de dados real do Supabase (@supabase/supabase-js).
 */
export const shoppingService: IShoppingService = new SupabaseShoppingService();

export * from './types';
export * from './supabaseShoppingService';
export * from './supabaseClient';
