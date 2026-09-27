import { LayoutDashboard, ShoppingCart, Plus, Users } from 'lucide-react';
import { NotificationBadge } from '../common/NotificationBadge';
import { cn } from '../../utils/cn';

export interface BottomNavProps {
  currentTab: 'dashboard' | 'shopping';
  onSelectTab: (tab: 'dashboard' | 'shopping') => void;
  onOpenAddModal: () => void;
  onOpenUserModal: () => void;
  unviewedCount: number;
}

export function BottomNav({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  onOpenUserModal,
  unviewedCount,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 px-4 py-1.5 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={cn(
            'flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition-colors',
            currentTab === 'dashboard'
              ? 'text-[#2E7D32] font-bold'
              : 'text-slate-400 hover:text-slate-700'
          )}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Início</span>
        </button>

        {/* Botão Central Adicionar (FAB) */}
        <div className="relative -top-5">
          <button
            onClick={onOpenAddModal}
            aria-label="Adicionar produto"
            className="w-13 h-13 p-3.5 rounded-full bg-[#2E7D32] text-white shadow-lg shadow-emerald-700/30 hover:bg-[#256629] active:scale-95 transition-all flex items-center justify-center ring-4 ring-[#F8FAFC]"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Lista de Compras */}
        <button
          onClick={() => onSelectTab('shopping')}
          className={cn(
            'flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition-colors relative',
            currentTab === 'shopping'
              ? 'text-[#2E7D32] font-bold'
              : 'text-slate-400 hover:text-slate-700'
          )}
        >
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          <span>Lista</span>
          <NotificationBadge count={unviewedCount} />
        </button>

        {/* Família */}
        <button
          onClick={onOpenUserModal}
          className="flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-700 transition-colors"
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Família</span>
        </button>
      </div>
    </nav>
  );
}
