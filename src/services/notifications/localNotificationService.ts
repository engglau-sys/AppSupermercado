import { INotificationService } from './types';
import { ShoppingItem } from '../../types/shopping';

const LAST_VIEWED_KEY_PREFIX = 'app_supermercado_last_viewed_';

export class LocalNotificationService implements INotificationService {
  private subscribers: Map<string, Set<(count: number) => void>> = new Map();

  private getLastViewedTimestamp(userId: string): string {
    const key = `${LAST_VIEWED_KEY_PREFIX}${userId}`;
    const stored = localStorage.getItem(key);

    if (stored) return stored;

    // Para efeito de demonstração na primeira execução (MVP):
    // Se o utilizador nunca abriu a app, consideramos que viu a lista há 80 minutos.
    // Assim, artigos adicionados recentemente por outros familiares surgem como novos.
    const initialLastViewed = new Date(Date.now() - 1000 * 60 * 80).toISOString();
    try {
      localStorage.setItem(key, initialLastViewed);
    } catch (e) {
      console.error('Erro ao guardar timestamp no localStorage:', e);
    }
    return initialLastViewed;
  }

  async getUnviewedCount(
    userId: string,
    _familyId: string,
    items: ShoppingItem[]
  ): Promise<number> {
    const lastViewed = this.getLastViewedTimestamp(userId);
    const lastViewedTime = new Date(lastViewed).getTime();

    // Contar artigos adicionados por OUTROS membros da família criados após a última visualização
    const unviewedItems = items.filter((item) => {
      if (item.createdBy === userId) return false;
      const createdTime = new Date(item.createdAt).getTime();
      return createdTime > lastViewedTime;
    });

    return unviewedItems.length;
  }

  async markAllAsViewed(userId: string, _familyId: string): Promise<void> {
    const key = `${LAST_VIEWED_KEY_PREFIX}${userId}`;
    const now = new Date().toISOString();

    try {
      localStorage.setItem(key, now);
    } catch (e) {
      console.error('Erro ao atualizar visualização no localStorage:', e);
    }

    // Notificar os subscritores para atualizar o badge para 0 imediatamente
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
