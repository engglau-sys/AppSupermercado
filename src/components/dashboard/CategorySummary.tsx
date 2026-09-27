import { Category } from '../../types/shopping';
import { CATEGORY_METADATA } from '../../utils/formatters';

export interface CategorySummaryProps {
  categoryCounts: Record<Category, number>;
  totalItems: number;
  onSelectCategory?: (category: Category) => void;
}

export function CategorySummary({
  categoryCounts,
  totalItems,
  onSelectCategory,
}: CategorySummaryProps) {
  // Apenas categorias que têm pelo menos 1 artigo
  const activeCategories = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]) as [Category, number][];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Categorias na Lista
          </h3>
          <p className="text-xs text-slate-500">
            {activeCategories.length} categorias ativas com artigos
          </p>
        </div>
      </div>

      {activeCategories.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs">
          Ainda não foram adicionados artigos com categorias.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {activeCategories.map(([category, count]) => {
            const meta = CATEGORY_METADATA[category];
            const pct = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory && onSelectCategory(category)}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-[#E8F5E9]/40 hover:border-[#2E7D32]/30 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg leading-none select-none">
                    {meta.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-700 truncate group-hover:text-[#2E7D32]">
                      {category}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {pct}% do total
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
