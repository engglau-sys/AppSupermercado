import { ShoppingItem } from '../../types/shopping';

/**
 * Interface do serviço de notificações familiares.
 * Preparada para suportar tanto LocalStorage (MVP V1) como Supabase Realtime (V2).
 */
export interface INotificationService {
  /**
   * Obtém a contagem de artigos adicionados por outros membros da família
   * que ainda não foram visualizados pelo utilizador.
   */
  getUnviewedCount(
    userId: string,
    familyId: string,
    items: ShoppingItem[]
  ): Promise<number>;

  /**
   * Marca todos os artigos atuais como visualizados pelo utilizador.
   */
  markAllAsViewed(userId: string, familyId: string): Promise<void>;

  /**
   * Subscreve a alterações na contagem de novos artigos (compatível com Supabase Realtime).
   * Retorna uma função para cancelar a subscrição (unsubscribe).
   */
  subscribeToChanges(
    userId: string,
    callback: (count: number) => void
  ): () => void;
}
