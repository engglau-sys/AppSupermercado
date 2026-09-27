import { FilterStatus } from '../../types/shopping';
import { cn } from '../../utils/cn';

export interface StatusFilterTabsProps {
  status: FilterStatus;
  onChangeStatus: (status: FilterStatus) => void;
  pendingCount: number;
  purchasedCount: number;
  totalCount: number;
}

export function StatusFilterTabs({
  status,
  onChangeStatus,
  pendingCount,
  purchasedCount,
  totalCount,
}: StatusFilterTabsProps) {
  const tabs = [
    { id: 'all' as FilterStatus, label: 'Todos', count: totalCount },
    { id: 'pending' as FilterStatus, label: 'Por comprar', count: pendingCount },
    { id: 'purchased' as FilterStatus, label: 'Comprados', count: purchasedCount },
  ];

  return (
    <div className="flex bg-slate-200/70 p-1 rounded-xl w-full sm:w-auto">
      {tabs.map((tab) => {
        const isActive = status === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeStatus(tab.id)}
            className={cn(
              'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-150',
              isActive
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                isActive
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'bg-slate-300/60 text-slate-600'
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
