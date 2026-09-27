import {
  ShoppingItem,
  CreateShoppingItemDTO,
  UpdateShoppingItemDTO,
  Family,
  User,
} from '../types/shopping';

/**
 * Interface agnóstica para operações da lista de compras.
 * Permite alternar perfeitamente entre LocalShoppingService (localStorage)
 * e SupabaseShoppingService (futura integração Supabase) sem alterar os componentes.
 */
export interface IShoppingService {
  /** Obter todos os itens de uma família */
  getItems(familyId: string): Promise<ShoppingItem[]>;

  /** Adicionar um novo item à lista */
  addItem(item: CreateShoppingItemDTO): Promise<ShoppingItem>;

  /** Alternar o estado de comprado de um item */
  togglePurchased(id: string, isPurchased: boolean, userId: string): Promise<ShoppingItem>;

  /** Atualizar detalhes de um item */
  updateItem(id: string, updates: UpdateShoppingItemDTO): Promise<ShoppingItem>;

  /** Eliminar um item da lista */
  deleteItem(id: string): Promise<void>;

  /** Limpar todos os itens já comprados da lista */
  clearPurchased(familyId: string): Promise<void>;

  /** Obter a família por ID */
  getFamily(familyId: string): Promise<Family | null>;

  /** Obter os utilizadores/membros de uma família */
  getFamilyUsers(familyId: string): Promise<User[]>;

  /** Restaurar os dados iniciais de demonstração */
  resetToMockData(): Promise<void>;
}
