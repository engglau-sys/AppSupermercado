import { Category } from '../../types/shopping';
import { CATEGORY_METADATA } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export interface CategoryFilterBarProps {
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
  categoryCounts?: Record<Category, number>;
}

export function CategoryFilterBar({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryFilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar select-none -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* Opção Todas */}
      <button
        onClick={() => onSelectCategory('all')}
        className={cn(
          'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 border',
          selectedCategory === 'all'
            ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        )}
      >
        <span>🛒</span>
        <span>Todas</span>
      </button>

      {/* Lista de Categorias do Enum Fixo */}
      {Object.values(Category).map((category) => {
        const meta = CATEGORY_METADATA[category];
        const isSelected = selectedCategory === category;
        const count = categoryCounts ? categoryCounts[category] : undefined;

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 border',
              isSelected
                ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            <span>{meta.emoji}</span>
            <span>{category}</span>
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  'ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-100 text-slate-600'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
