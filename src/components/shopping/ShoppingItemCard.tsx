import { ShoppingItem, User } from '../../types/shopping';
import { CATEGORY_METADATA, formatRelativeDate } from '../../utils/formatters';
import { Check, Trash2, Plus, Minus, StickyNote } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ShoppingItemCardProps {
  item: ShoppingItem;
  creator?: User;
  purchaser?: User;
  onTogglePurchased: (id: string, currentStatus: boolean) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onDelete: (id: string) => void;
}

export function ShoppingItemCard({
  item,
  creator,
  purchaser,
  onTogglePurchased,
  onUpdateQuantity,
  onDelete,
}: ShoppingItemCardProps) {
  const meta = CATEGORY_METADATA[item.category];

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQuantity(item.id, Number((item.quantity + 1).toFixed(1)));
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, Number((item.quantity - 1).toFixed(1)));
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl border p-4 sm:p-5 transition-all duration-200 shadow-soft',
        item.isPurchased
          ? 'bg-slate-50/70 border-slate-200/60 opacity-85'
          : 'border-slate-200 hover:border-[#2E7D32]/40 hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox de Compra + Nome do Artigo */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Checkbox grande otimizada para toque rápido no supermercado */}
          <button
            type="button"
            onClick={() => onTogglePurchased(item.id, item.isPurchased)}
            aria-label={item.isPurchased ? 'Desmarcar como comprado' : 'Marcar como comprado'}
            className={cn(
              'w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-150 shrink-0 mt-0.5',
              'focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 active:scale-90 select-none',
              item.isPurchased
                ? 'bg-[#2E7D32] text-white shadow-sm ring-2 ring-[#2E7D32]/20'
                : 'border-2 border-slate-300 hover:border-[#2E7D32] bg-white text-transparent hover:bg-slate-50'
            )}
          >
            <Check
              className={cn(
                'w-4 h-4 sm:w-5 sm:h-5 stroke-[3] transition-transform',
                item.isPurchased ? 'scale-100' : 'scale-0'
              )}
            />
          </button>

          {/* Detalhes do Produto */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4
                onClick={() => onTogglePurchased(item.id, item.isPurchased)}
                className={cn(
                  'text-base font-bold tracking-tight cursor-pointer select-none transition-colors',
                  item.isPurchased
                    ? 'line-through text-slate-400'
                    : 'text-slate-800 hover:text-[#2E7D32]'
                )}
              >
                {item.name}
              </h4>

              {/* Tag de Categoria com Emoji e Cor Específica */}
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border',
                  meta.badgeBg
                )}
              >
                <span>{meta.emoji}</span>
                <span>{item.category}</span>
              </span>

              {/* Estado Badge */}
              <span
                className={cn(
                  'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border',
                  item.isPurchased
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                )}
              >
                {item.isPurchased ? 'Comprado' : 'Por comprar'}
              </span>
            </div>

            {/* Notas do Produto (se existirem) */}
            {item.notes && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 italic">
                <StickyNote className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{item.notes}</span>
              </div>
            )}

            {/* Quem Adicionou e Quem Comprou */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-xs text-slate-400">
              {/* Quem adicionou */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs"
                  style={{
                    backgroundColor: creator?.avatarColor || '#2E7D32',
                  }}
                >
                  {(creator?.name || 'G').charAt(0).toUpperCase()}
                </div>
                <span>
                  Adicionado por{' '}
                  <strong className="text-slate-600 font-semibold">
                    {creator?.name || 'Glaucia'}
                  </strong>
                </span>
                <span className="text-slate-300">•</span>
                <span>{formatRelativeDate(item.createdAt)}</span>
              </div>

              {/* Se comprado, mostrar quem comprou */}
              {item.isPurchased && purchaser && (
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <span>• Comprado por {purchaser.name}</span>
                  {item.purchasedAt && (
                    <span className="text-slate-400 font-normal">
                      ({formatRelativeDate(item.purchasedAt)})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controlos Laterais: Quantidade e Eliminar */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
          {/* Controlo Rápido de Quantidade */}
          <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200/80">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1 || item.isPurchased}
              title="Diminuir quantidade"
              aria-label="Diminuir quantidade"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="min-w-[48px] text-center text-xs font-bold text-slate-800 px-1">
              {item.quantity} {item.unit || ''}
            </span>

            <button
              onClick={handleIncrement}
              disabled={item.isPurchased}
              title="Aumentar quantidade"
              aria-label="Aumentar quantidade"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Botão Eliminar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            title="Eliminar artigo"
            aria-label="Eliminar artigo"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
