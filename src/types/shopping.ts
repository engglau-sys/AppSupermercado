// Enums e tipos principais da aplicação AppSupermercado

/**
 * Categorias fixas do supermercado.
 * Conforme requisito: Lacticínios, Fruta, Legumes, Carne, Peixe, Congelados, Bebidas, Limpeza, Higiene, Outros.
 */
export enum Category {
  LACTICINIOS = 'Lacticínios',
  FRUTA = 'Fruta',
  LEGUMES = 'Legumes',
  CARNE = 'Carne',
  PEIXE = 'Peixe',
  CONGELADOS = 'Congelados',
  BEBIDAS = 'Bebidas',
  LIMPEZA = 'Limpeza',
  HIGIENE = 'Higiene',
  OUTROS = 'Outros',
}

export type CategoryValue = `${Category}`;

/**
 * Modelo de Família
 */
export interface Family {
  id: string;
  name: string;
}

/**
 * Modelo de Utilizador
 */
export interface User {
  id: string;
  familyId: string;
  name: string;
  avatarColor: string;
  avatar?: string;
  color?: string;
}

/**
 * Modelo de Item da Lista de Compras
 */
export interface ShoppingItem {
  id: string;
  familyId: string;
  name: string;
  quantity: number;
  unit?: string; // Ex: 'un', 'kg', 'g', 'l', 'emb'
  category: Category;
  createdBy: string; // User ID
  createdAt: string; // ISO 8601 string
  isPurchased: boolean;
  purchasedBy: string | null; // User ID
  purchasedAt: string | null; // ISO 8601 string
  notes?: string;
  viewedBy?: string[];
}

/**
 * DTO para criação de novos itens
 */
export interface CreateShoppingItemDTO {
  name: string;
  quantity: number;
  unit?: string;
  category: Category;
  createdBy: string;
  familyId: string;
  notes?: string;
}

/**
 * DTO para atualização de itens existentes
 */
export interface UpdateShoppingItemDTO {
  name?: string;
  quantity?: number;
  unit?: string;
  category?: Category;
  notes?: string;
}

/**
 * Resumo estatístico do Dashboard
 */
export interface ShoppingListStats {
  totalItems: number;
  pendingItems: number;
  purchasedItems: number;
  completionPercentage: number;
  categoryCounts: Record<Category, number>;
}

/**
 * Filtros para a lista de compras
 */
export type FilterStatus = 'all' | 'pending' | 'purchased';
