import { ShoppingCart, CheckCheck, Percent, Layers } from 'lucide-react';
import { ShoppingListStats } from '../../types/shopping';

export interface StatsCardsProps {
  stats: ShoppingListStats;
  onNavigateToPending?: () => void;
  onNavigateToPurchased?: () => void;
}

export function StatsCards({
  stats,
  onNavigateToPending,
  onNavigateToPurchased,
}: StatsCardsProps) {
  const cards = [
    {
      title: 'Por comprar',
      value: stats.pendingItems,
      subtitle: stats.pendingItems === 1 ? 'artigo pendente' : 'artigos pendentes',
      icon: ShoppingCart,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/80',
      borderColor: 'border-amber-200/70',
      onClick: onNavigateToPending,
      clickable: Boolean(onNavigateToPending),
    },
    {
      title: 'Comprados',
      value: stats.purchasedItems,
      subtitle: stats.purchasedItems === 1 ? 'artigo no carrinho' : 'artigos no carrinho',
      icon: CheckCheck,
      iconColor: 'text-[#2E7D32]',
      bgColor: 'bg-[#E8F5E9]',
      borderColor: 'border-emerald-200/80',
      onClick: onNavigateToPurchased,
      clickable: Boolean(onNavigateToPurchased),
    },
    {
      title: 'Conclusão',
      value: `${stats.completionPercentage}%`,
      subtitle: 'da lista finalizada',
      icon: Percent,
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50/80',
      borderColor: 'border-emerald-200/70',
      clickable: false,
    },
    {
      title: 'Total de itens',
      value: stats.totalItems,
      subtitle: stats.totalItems === 1 ? 'artigo registado' : 'artigos registados',
      icon: Layers,
      iconColor: 'text-slate-600',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      clickable: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            onClick={card.onClick}
            className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-soft transition-all duration-200 ${
              card.clickable
                ? 'hover:border-[#2E7D32]/50 hover:shadow-md cursor-pointer active:scale-[0.98]'
                : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.bgColor} ${card.iconColor}`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                {card.value}
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
