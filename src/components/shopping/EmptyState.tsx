import { ShoppingCart, SearchX, Plus, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export interface EmptyStateProps {
  isFiltering: boolean;
  onClearFilters?: () => void;
  onOpenAddModal: () => void;
  onResetData?: () => void;
}

export function EmptyState({
  isFiltering,
  onClearFilters,
  onOpenAddModal,
  onResetData,
}: EmptyStateProps) {
  if (isFiltering) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-soft">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Nenhum artigo encontrado
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          Não encontrámos produtos que correspondam à pesquisa ou aos filtros selecionados.
        </p>
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Limpar Filtros
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 sm:p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto mb-3">
        <ShoppingCart className="w-7 h-7 stroke-[2]" />
      </div>
      <h3 className="text-base font-bold text-slate-800">
        A lista de compras está vazia
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
        Começa por adicionar o primeiro artigo para a família comprar no supermercado.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onOpenAddModal}>
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Adicionar Artigo
        </Button>
        {onResetData && (
          <Button variant="outline" onClick={onResetData}>
            <RotateCcw className="w-4 h-4" />
            Restaurar Dados Demo
          </Button>
        )}
      </div>
    </div>
  );
}
