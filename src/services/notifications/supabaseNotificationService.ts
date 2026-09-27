import { INotificationService } from './types';
import { ShoppingItem } from '../../types/shopping';
import { isSupabaseConfigured } from '../supabaseClient';

/**
 * Esqueleto do serviço de notificações preparado para integração com Supabase Realtime (V2).
 * Utiliza canais Realtime do PostgreSQL para transmitir novos itens em tempo real.
 */
export class SupabaseNotificationService implements INotificationService {
  constructor() {
    if (!isSupabaseConfigured()) {
      console.warn(
        '[AppSupermercado] SupabaseNotificationService: Supabase não está configurado.'
      );
    }
  }

  async getUnviewedCount(
    _userId: string,
    _familyId: string,
    _items: ShoppingItem[]
  ): Promise<number> {
    return 0;
  }

  async markAllAsViewed(_userId: string, _familyId: string): Promise<void> {
    // No futuro: atualizar tabela user_notification_status no Supabase
  }

  subscribeToChanges(
    _userId: string,
    _callback: (count: number) => void
  ): () => void {
    // No futuro: canal Realtime do Supabase
    // const channel = supabase.channel('shopping_items_changes').on(...)
    return () => {};
  }
}
