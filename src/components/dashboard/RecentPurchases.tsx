import { ShoppingItem, User } from '../../types/shopping';
import { formatRelativeDate, CATEGORY_METADATA } from '../../utils/formatters';
import { Check, Clock, PlusCircle } from 'lucide-react';

export interface RecentPurchasesProps {
  items: ShoppingItem[];
  getUserById: (userId: string | null) => User | undefined;
  onNavigateToList: () => void;
}

export function RecentPurchases({
  items,
  getUserById,
  onNavigateToList,
}: RecentPurchasesProps) {
  // 5 artigos mais recentes
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Atividade Recente da Família
          </h3>
          <p className="text-xs text-slate-500">
            Últimos artigos adicionados ou comprados
          </p>
        </div>
        <button
          onClick={onNavigateToList}
          className="text-xs font-semibold text-[#2E7D32] hover:text-[#256629] hover:underline"
        >
          Ver todos
        </button>
      </div>

      {recentItems.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs">
          Sem atividade recente na lista.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recentItems.map((item) => {
            const creator = getUserById(item.createdBy);
            const purchaser = item.isPurchased ? getUserById(item.purchasedBy) : null;
            const meta = CATEGORY_METADATA[item.category];

            return (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      item.isPurchased
                        ? 'bg-[#E8F5E9] text-[#2E7D32]'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {item.isPurchased ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <PlusCircle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold truncate ${
                          item.isPurchased
                            ? 'line-through text-slate-400'
                            : 'text-slate-800'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="text-xs font-bold text-slate-500 shrink-0">
                        × {item.quantity} {item.unit || ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        {meta.emoji} {item.category}
                      </span>
                      <span>•</span>
                      <span>
                        {item.isPurchased && purchaser
                          ? `Comprado por ${purchaser.name}`
                          : `Adicionado por ${creator?.name || 'Família'}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatRelativeDate(
                      item.isPurchased && item.purchasedAt
                        ? item.purchasedAt
                        : item.createdAt
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
