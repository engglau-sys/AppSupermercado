import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShoppingItem,
  Category,
  CreateShoppingItemDTO,
  UpdateShoppingItemDTO,
  ShoppingListStats,
  FilterStatus,
} from '../types/shopping';
import { shoppingService } from '../services';

export function useShoppingList(familyId: string, currentUserId: string) {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // Carregar os itens da família
  const refreshItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await shoppingService.getItems(familyId);
      setItems(data);
    } catch (err) {
      console.error('Erro ao obter itens de compras:', err);
    } finally {
      setIsLoading(false);
    }
  }, [familyId]);

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  // Adicionar novo item
  const addItem = useCallback(
    async (
      input: Omit<CreateShoppingItemDTO, 'familyId' | 'createdBy'> & {
        createdBy?: string;
      }
    ) => {
      try {
        setIsProcessing(true);
        const newItem = await shoppingService.addItem({
          ...input,
          familyId,
          createdBy: input.createdBy || currentUserId,
        });
        setItems((prev) => [newItem, ...prev]);
        return newItem;
      } catch (err) {
        console.error('Erro ao adicionar artigo:', err);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [familyId, currentUserId]
  );

  // Marcar / Desmarcar como comprado
  const togglePurchased = useCallback(
    async (id: string, currentlyPurchased: boolean) => {
      // Optimistic update para resposta instantânea ao toque (crucial no supermercado)
      const nextStatus = !currentlyPurchased;
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isPurchased: nextStatus,
                purchasedBy: nextStatus ? currentUserId : null,
                purchasedAt: nextStatus ? new Date().toISOString() : null,
              }
            : item
        )
      );

      try {
        await shoppingService.togglePurchased(id, nextStatus, currentUserId);
      } catch (err) {
        console.error('Erro ao alternar estado do artigo:', err);
        // Reverter caso haja falha
        await refreshItems();
      }
    },
    [currentUserId, refreshItems]
  );

  // Atualizar artigo
  const updateItem = useCallback(
    async (id: string, updates: UpdateShoppingItemDTO) => {
      try {
        setIsProcessing(true);
        const updated = await shoppingService.updateItem(id, updates);
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        return updated;
      } catch (err) {
        console.error('Erro ao atualizar artigo:', err);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // Eliminar artigo
  const deleteItem = useCallback(
    async (id: string) => {
      // Optimistic update
      setItems((prev) => prev.filter((item) => item.id !== id));
      try {
        await shoppingService.deleteItem(id);
      } catch (err) {
        console.error('Erro ao eliminar artigo:', err);
        await refreshItems();
      }
    },
    [refreshItems]
  );

  // Limpar todos os comprados
  const clearPurchased = useCallback(async () => {
    try {
      setIsProcessing(true);
      await shoppingService.clearPurchased(familyId);
      setItems((prev) => prev.filter((item) => !item.isPurchased));
    } catch (err) {
      console.error('Erro ao limpar artigos comprados:', err);
      await refreshItems();
    } finally {
      setIsProcessing(false);
    }
  }, [familyId, refreshItems]);

  // Restaurar dados de exemplo
  const resetToMockData = useCallback(async () => {
    try {
      setIsProcessing(true);
      await shoppingService.resetToMockData();
      await refreshItems();
    } catch (err) {
      console.error('Erro ao restaurar dados:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [refreshItems]);

  // Estatísticas calculadas para o Dashboard
  const stats: ShoppingListStats = useMemo(() => {
    const totalItems = items.length;
    const purchasedItems = items.filter((i) => i.isPurchased).length;
    const pendingItems = totalItems - purchasedItems;
    const completionPercentage =
      totalItems === 0 ? 0 : Math.round((purchasedItems / totalItems) * 100);

    const categoryCounts = Object.values(Category).reduce((acc, cat) => {
      acc[cat] = items.filter((i) => i.category === cat).length;
      return acc;
    }, {} as Record<Category, number>);

    return {
      totalItems,
      pendingItems,
      purchasedItems,
      completionPercentage,
      categoryCounts,
    };
  }, [items]);

  // Itens filtrados com base na pesquisa, categoria e estado
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filtro por estado
      if (filterStatus === 'pending' && item.isPurchased) return false;
      if (filterStatus === 'purchased' && !item.isPurchased) return false;

      // Filtro por categoria
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Filtro por pesquisa (nome ou notas)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchNotes = item.notes?.toLowerCase().includes(query) || false;
        return matchName || matchNotes;
      }

      return true;
    });
  }, [items, filterStatus, selectedCategory, searchQuery]);

  return {
    items,
    filteredItems,
    stats,
    isLoading,
    isProcessing,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterStatus,
    setFilterStatus,
    addItem,
    togglePurchased,
    updateItem,
    deleteItem,
    clearPurchased,
    resetToMockData,
    refreshItems,
  };
}
