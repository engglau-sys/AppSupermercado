import { ShoppingListStats, ShoppingItem, User, Category } from '../types/shopping';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ProgressBar } from '../components/dashboard/ProgressBar';
import { CategorySummary } from '../components/dashboard/CategorySummary';
import { RecentPurchases } from '../components/dashboard/RecentPurchases';
import { Button } from '../components/common/Button';
import { NotificationBadge } from '../components/common/NotificationBadge';
import { ShoppingCart, Plus, Sparkles } from 'lucide-react';

export interface DashboardPageProps {
  stats: ShoppingListStats;
  items: ShoppingItem[];
  getUserById: (userId: string | null) => User | undefined;
  onNavigateToList: (category?: Category, status?: 'pending' | 'purchased') => void;
  onOpenAddModal: () => void;
  currentUserName: string;
  unviewedCount: number;
}

export function DashboardPage({
  stats,
  items,
  getUserById,
  onNavigateToList,
  onOpenAddModal,
  currentUserName,
  unviewedCount,
}: DashboardPageProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Saudação e Ações Rápidas */}
      <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8F5E9]/60 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painel Familiar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Olá, {currentUserName}! 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-lg">
              Aqui está o ponto de situação da lista de compras da família.
              {stats.pendingItems > 0
                ? ` Tens ${stats.pendingItems} ${
                    stats.pendingItems === 1 ? 'artigo' : 'artigos'
                  } por comprar no supermercado.`
                : ' Não há artigos pendentes neste momento!'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              onClick={() => onNavigateToList()}
              variant="outline"
              className="flex-1 sm:flex-initial relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Ver Lista</span>
              <NotificationBadge count={unviewedCount} />
            </Button>
            <Button
              onClick={onOpenAddModal}
              className="flex-1 sm:flex-initial"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      {/* Cartões com Métricas Solicitadas no Prompt */}
      <StatsCards
        stats={stats}
        onNavigateToPending={() => onNavigateToList(undefined, 'pending')}
        onNavigateToPurchased={() => onNavigateToList(undefined, 'purchased')}
      />

      {/* Barra de Progresso Visual */}
      <ProgressBar
        percentage={stats.completionPercentage}
        pendingCount={stats.pendingItems}
        purchasedCount={stats.purchasedItems}
      />

      {/* Grelha de Detalhes: Categorias e Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySummary
          categoryCounts={stats.categoryCounts}
          totalItems={stats.totalItems}
          onSelectCategory={(category) => onNavigateToList(category)}
        />

        <RecentPurchases
          items={items}
          getUserById={getUserById}
          onNavigateToList={() => onNavigateToList()}
        />
      </div>
    </div>
  );
}
