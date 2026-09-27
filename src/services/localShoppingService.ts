import { IShoppingService } from './types';
import {
  ShoppingItem,
  CreateShoppingItemDTO,
  UpdateShoppingItemDTO,
  Family,
  User,
} from '../types/shopping';
import {
  INITIAL_FAMILY,
  INITIAL_USERS,
  INITIAL_SHOPPING_ITEMS,
} from './mockData';

const STORAGE_KEYS = {
  ITEMS: 'app_supermercado_items_v1',
  USERS: 'app_supermercado_users_v1',
  FAMILY: 'app_supermercado_family_v1',
};

// Simulação de pequeno delay assíncrono para garantir comportamento realista de Promise
const simulateLatency = (ms: number = 80) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class LocalShoppingService implements IShoppingService {
  private getStored<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? (JSON.parse(data) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Erro ao guardar no localStorage:', e);
    }
  }

  private ensureInitialized(): void {
    if (!localStorage.getItem(STORAGE_KEYS.FAMILY)) {
      this.setStored(STORAGE_KEYS.FAMILY, INITIAL_FAMILY);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
      this.setStored(STORAGE_KEYS.ITEMS, INITIAL_SHOPPING_ITEMS);
    }
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.ensureInitialized();
    }
  }

  async getItems(familyId: string): Promise<ShoppingItem[]> {
    await simulateLatency();
    const items = this.getStored<ShoppingItem[]>(
      STORAGE_KEYS.ITEMS,
      INITIAL_SHOPPING_ITEMS
    );
    return items.filter((item) => item.familyId === familyId);
  }

  async addItem(itemDTO: CreateShoppingItemDTO): Promise<ShoppingItem> {
    await simulateLatency();
    const items = this.getStored<ShoppingItem[]>(
      STORAGE_KEYS.ITEMS,
      INITIAL_SHOPPING_ITEMS
    );

    const newItem: ShoppingItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      familyId: itemDTO.familyId,
      name: itemDTO.name.trim(),
      quantity: Number(itemDTO.quantity) || 1,
      unit: itemDTO.unit || 'un',
      category: itemDTO.category,
      createdBy: itemDTO.createdBy,
      createdAt: new Date().toISOString(),
      isPurchased: false,
      purchasedBy: null,
      purchasedAt: null,
      notes: itemDTO.notes?.trim() || undefined,
    };

    // Colocar o novo item no topo
    const updated = [newItem, ...items];
    this.setStored(STORAGE_KEYS.ITEMS, updated);
    return newItem;
  }

  async togglePurchased(
    id: string,
    isPurchased: boolean,
    userId: string
  ): Promise<ShoppingItem> {
    await simulateLatency();
    const items = this.getStored<ShoppingItem[]>(
      STORAGE_KEYS.ITEMS,
      INITIAL_SHOPPING_ITEMS
    );

    let updatedItem: ShoppingItem | null = null;

    const updated = items.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          isPurchased,
          purchasedBy: isPurchased ? userId : null,
          purchasedAt: isPurchased ? new Date().toISOString() : null,
        };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      throw new Error(`Artigo com ID ${id} não foi encontrado.`);
    }

    this.setStored(STORAGE_KEYS.ITEMS, updated);
    return updatedItem;
  }

  async updateItem(
    id: string,
    updates: UpdateShoppingItemDTO
  ): Promise<ShoppingItem> {
    await simulateLatency();
    const items = this.getStored<ShoppingItem[]>(
      STORAGE_KEYS.ITEMS,
      INITIAL_SHOPPING_ITEMS
    );

    let updatedItem: ShoppingItem | null = null;

    const updated = items.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          ...(updates.name !== undefined && { name: updates.name.trim() }),
          ...(updates.quantity !== undefined && {
            quantity: Number(updates.quantity) || 1,
          }),
          ...(updates.unit !== undefined && { unit: updates.unit }),
          ...(updates.category !== undefined && { category: updates.category }),
          ...(updates.notes !== undefined && { notes: updates.notes.trim() }),
        };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      throw new Error(`Artigo com ID ${id} não foi encontrado.`);
    }

    this.setStored(STORAGE_KEYS.ITEMS, updated);
    return updatedItem;
  }

  async deleteItem(id: string): Promise<void> {
    await simulateLatency();
    const items = this.getStored<ShoppingItem[]>(
      STORAGE_KEYS.ITEMS,
      INITIAL_SHOPPING_ITEMS
    );
    const updated = items.filter((item) => item.id !== id);
    this.setStored(STORAGE_KEYS.ITEMS, updated);
  }

  async clearPurchased(familyId: string): Promise<void> {
    await simulateLatency();
    const items = this.getStored<ShoppingItem[]>(
      STORAGE_KEYS.ITEMS,
      INITIAL_SHOPPING_ITEMS
    );
    const updated = items.filter(
      (item) => !(item.familyId === familyId && item.isPurchased)
    );
    this.setStored(STORAGE_KEYS.ITEMS, updated);
  }

  async getFamily(familyId: string): Promise<Family | null> {
    await simulateLatency();
    const family = this.getStored<Family>(
      STORAGE_KEYS.FAMILY,
      INITIAL_FAMILY
    );
    return family.id === familyId ? family : null;
  }

  async getFamilyUsers(familyId: string): Promise<User[]> {
    await simulateLatency();
    const users = this.getStored<User[]>(
      STORAGE_KEYS.USERS,
      INITIAL_USERS
    );
    return users.filter((u) => u.familyId === familyId);
  }

  async resetToMockData(): Promise<void> {
    await simulateLatency(150);
    this.setStored(STORAGE_KEYS.FAMILY, INITIAL_FAMILY);
    this.setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.setStored(STORAGE_KEYS.ITEMS, INITIAL_SHOPPING_ITEMS);
  }
}
