import { useState } from 'react';
import {
  ShoppingItem,
  Category,
  FilterStatus,
  User,
  ShoppingListStats,
} from '../types/shopping';
import { ShoppingItemCard } from '../components/shopping/ShoppingItemCard';
import { CategoryFilterBar } from '../components/shopping/CategoryFilterBar';
import { StatusFilterTabs } from '../components/shopping/StatusFilterTabs';
import { EmptyState } from '../components/shopping/EmptyState';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  Search,
  Plus,
  Trash2,
  CheckCheck,
  X,
  ListFilter,
} from 'lucide-react';

export interface ShoppingListPageProps {
  items: ShoppingItem[];
  filteredItems: ShoppingItem[];
  stats: ShoppingListStats;
  getUserById: (userId: string | null) => User | undefined;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  filterStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  onTogglePurchased: (id: string, currentStatus: boolean) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onDelete: (id: string) => void;
  onClearPurchased: () => void;
  onOpenAddModal: () => void;
  onResetData?: () => void;
}

export function ShoppingListPage({
  items,
  filteredItems,
  stats,
  getUserById,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  filterStatus,
  onStatusChange,
  onTogglePurchased,
  onUpdateQuantity,
  onDelete,
  onClearPurchased,
  onOpenAddModal,
  onResetData,
}: ShoppingListPageProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Separar itens pendentes dos comprados se o filtro for 'all'
  const pendingItems = filteredItems.filter((item) => !item.isPurchased);
  const purchasedItems = filteredItems.filter((item) => item.isPurchased);

  const hasFiltersActive =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'all' ||
    filterStatus !== 'all';

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onStatusChange('all');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Barra Superior de Controlos e Pesquisa */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-soft space-y-4">
        {/* Linha 1: Pesquisa e Tabs de Estado */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Campo de Pesquisa */}
          <div className="flex-1">
            <Input
              placeholder="Pesquisar produto ou nota..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={
                searchQuery ? (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null
              }
            />
          </div>

          {/* Separadores Comprados / Pendentes */}
          <StatusFilterTabs
            status={filterStatus}
            onChangeStatus={onStatusChange}
            pendingCount={stats.pendingItems}
            purchasedCount={stats.purchasedItems}
            totalCount={stats.totalItems}
          />
        </div>

        {/* Linha 2: Filtro por Categoria (Enum Fixo) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <ListFilter className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Categorias</span>
            </div>
            {hasFiltersActive && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[#2E7D32] hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
          <CategoryFilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={onCategoryChange}
            categoryCounts={stats.categoryCounts}
          />
        </div>
      </div>

      {/* Barra de Ações Rápidas da Lista (Contador e Botão de Limpar Comprados) */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs sm:text-sm font-semibold text-slate-600">
          A mostrar{' '}
          <strong className="text-slate-900 font-bold">
            {filteredItems.length}
          </strong>{' '}
          {filteredItems.length === 1 ? 'artigo' : 'artigos'}
          {hasFiltersActive && (
            <span className="text-slate-400 font-normal">
              {' '}(filtrados de um total de {items.length})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {stats.purchasedItems > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar comprados</span>
              <span className="sm:hidden">Limpar</span>
            </button>
          )}

          <Button
            onClick={onOpenAddModal}
            size="sm"
            className="sm:hidden"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Adicionar</span>
          </Button>
        </div>
      </div>

      {/* Confirmação de Limpar Comprados */}
      {showClearConfirm && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Remover todos os artigos comprados?
            </h4>
            <p className="text-xs text-amber-700 mt-0.5">
              Esta ação irá retirar {stats.purchasedItems} artigos da lista.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 sm:flex-initial"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onClearPurchased();
                setShowClearConfirm(false);
              }}
              className="flex-1 sm:flex-initial"
            >
              Confirmar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Artigos */}
      {filteredItems.length === 0 ? (
        <EmptyState
          isFiltering={hasFiltersActive}
          onClearFilters={clearAllFilters}
          onOpenAddModal={onOpenAddModal}
          onResetData={onResetData}
        />
      ) : (
        <div className="space-y-6">
          {/* Itens Por Comprar */}
          {pendingItems.length > 0 && (
            <div className="space-y-2.5">
              {filterStatus === 'all' && (
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Por Comprar ({pendingItems.length})
                  </span>
                </div>
              )}
              <div className="space-y-2.5">
                {pendingItems.map((item) => (
                  <ShoppingItemCard
                    key={item.id}
                    item={item}
                    creator={getUserById(item.createdBy)}
                    purchaser={getUserById(item.purchasedBy)}
                    onTogglePurchased={onTogglePurchased}
                    onUpdateQuantity={onUpdateQuantity}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Itens Já Comprados */}
          {purchasedItems.length > 0 && (
            <div className="space-y-2.5 pt-2">
              {filterStatus === 'all' && (
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4 text-[#2E7D32]" />
                    Já Comprados ({purchasedItems.length})
                  </span>
                </div>
              )}
              <div className="space-y-2.5">
                {purchasedItems.map((item) => (
                  <ShoppingItemCard
                    key={item.id}
                    item={item}
                    creator={getUserById(item.createdBy)}
                    purchaser={getUserById(item.purchasedBy)}
                    onTogglePurchased={onTogglePurchased}
                    onUpdateQuantity={onUpdateQuantity}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
