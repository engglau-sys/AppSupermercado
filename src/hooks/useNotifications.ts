import { useState, useEffect, useCallback } from 'react';
import { ShoppingItem } from '../types/shopping';
import { notificationService } from '../services/notifications';

export function useNotifications(
  userId: string,
  familyId: string,
  items: ShoppingItem[]
) {
  const [unviewedCount, setUnviewedCount] = useState<number>(0);

  // Recalcular a contagem sempre que o utilizador, família ou itens mudarem
  useEffect(() => {
    let isMounted = true;

    async function checkUnviewed() {
      if (!userId || !familyId) return;
      try {
        const count = await notificationService.getUnviewedCount(
          userId,
          familyId,
          items
        );
        if (isMounted) {
          setUnviewedCount(count);
        }
      } catch (err) {
        console.error('Erro ao verificar itens não visualizados:', err);
      }
    }

    checkUnviewed();

    // Subscrever a atualizações (compatível com Realtime)
    const unsubscribe = notificationService.subscribeToChanges(
  userId,
  (count) => {
    if (!isMounted) return;

    if (count === -1) {
      void checkUnviewed();
    } else {
      setUnviewedCount(count);
    }
  }
);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userId, familyId, items]);

  // Função para marcar todos os itens como visualizados
  const markAsViewed = useCallback(async () => {
    if (!userId || !familyId) return;
    try {
      await notificationService.markAllAsViewed(userId, familyId);
      setUnviewedCount(0);
    } catch (err) {
      console.error('Erro ao marcar itens como visualizados:', err);
    }
  }, [userId, familyId]);

  return {
    unviewedCount,
    markAsViewed,
  };
}
