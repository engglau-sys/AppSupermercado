import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps {
  percentage: number;
  pendingCount: number;
  purchasedCount: number;
  className?: string;
}

export function ProgressBar({
  percentage,
  pendingCount,
  purchasedCount,
  className,
}: ProgressBarProps) {
  const isComplete = percentage === 100 && (pendingCount + purchasedCount > 0);

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-soft',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              isComplete
                ? 'bg-[#2E7D32] text-white'
                : 'bg-[#E8F5E9] text-[#2E7D32]'
            )}
          >
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <ShoppingBag className="w-4 h-4 stroke-[2.3]" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Progresso das Compras
            </h3>
            <p className="text-xs text-slate-500">
              {isComplete
                ? 'Tudo comprado! A lista está concluída.'
                : pendingCount === 0
                ? 'Não há itens na lista.'
                : `Faltam ${pendingCount} ${
                    pendingCount === 1 ? 'artigo' : 'artigos'
                  } por comprar`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-[#2E7D32] tracking-tight">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/60">
        <div
          className="bg-gradient-to-r from-[#2E7D32] to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2.5 text-[11px] text-slate-400 font-medium">
        <span>{purchasedCount} no carrinho</span>
        <span>{pendingCount} pendentes</span>
      </div>
    </div>
  );
}
