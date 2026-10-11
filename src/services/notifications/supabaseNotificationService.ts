import { INotificationService } from './types';
import { ShoppingItem } from '../../types/shopping';
import { supabase } from '../supabaseClient';

export class SupabaseNotificationService implements INotificationService {
  private subscribers: Map<string, Set<(count: number) => void>> = new Map();

  constructor() {
    this.initRealtimeSubscription();
  }

  private initRealtimeSubscription() {
    try {
      supabase
        .channel('public:shopping_items_notifs')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'shopping_items' },
          () => {
            // Notificar subscritores para verificar novos artigos
            this.subscribers.forEach((callbacks) => {
              callbacks.forEach((cb) => {
                // O hook useNotifications recalcula a contagem ao receber a notificação
                cb(-1); // -1 indica sinal para recalcular
              });
            });
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription não pôde ser iniciada:', e);
    }
  }

  /**
   * Calcula artigos não visualizados pelo utilizador:
   * - Artigos adicionados por outros utilizadores (createdBy !== userId)
   * - Onde o ID do utilizador ainda não consta na lista viewedBy do artigo
   */
  async getUnviewedCount(
    userId: string,
  familyId: string,
  _items: ShoppingItem[]
): Promise<number> {
  if (!userId || !familyId) return 0;

  const { data, error } = await supabase
    .from('shopping_items')
    .select('created_by, viewed_by')
    .eq('family_id', familyId);

  if (error) {
    console.error(
      'Erro ao consultar notificações no Supabase:',
      error
    );
    throw error;
  }

  const unviewed = (data ?? []).filter((item) => {
    // Não contar artigos criados pelo próprio utilizador
    if (item.created_by === userId) return false;

    const viewedBy = Array.isArray(item.viewed_by)
      ? item.viewed_by
      : [];

    // Contar apenas artigos ainda não visualizados
    return !viewedBy.includes(userId);
  });

  return unviewed.length;
}

  /**
   * Marca todos os artigos atuais como visualizados pelo utilizador,
   * atualizando o campo viewed_by na tabela shopping_items no Supabase.
   */
async markAllAsViewed(userId: string, familyId: string): Promise<void> {
  if (!userId || !familyId) {
    throw new Error('Utilizador ou família inválidos.');
  }

  const { data: items, error } = await supabase
    .from('shopping_items')
    .select('id, viewed_by')
    .eq('family_id', familyId);

  if (error) {
    console.error('Erro ao carregar artigos para visualização:', error);
    throw error;
  }

  for (const item of items ?? []) {
    const viewedList: string[] = Array.isArray(item.viewed_by)
      ? item.viewed_by
      : [];

    if (viewedList.includes(userId)) continue;

    const { error: updateError } = await supabase
      .from('shopping_items')
      .update({ viewed_by: [...viewedList, userId] })
      .eq('id', item.id)
      .eq('family_id', familyId);

    if (updateError) {
      console.error('Erro ao guardar visualização:', updateError);
      throw updateError;
    }
  }

  this.notifySubscribers(userId, 0);
}


  subscribeToChanges(
    userId: string,
    callback: (count: number) => void
  ): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }

    const userSubs = this.subscribers.get(userId)!;
    userSubs.add(callback);

    return () => {
      userSubs.delete(callback);
      if (userSubs.size === 0) {
        this.subscribers.delete(userId);
      }
    };
  }

  private notifySubscribers(userId: string, count: number): void {
    const userSubs = this.subscribers.get(userId);
    if (userSubs) {
      userSubs.forEach((cb) => cb(count));
    }
  }
}
