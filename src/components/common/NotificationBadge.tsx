import { cn } from '../../utils/cn';

export interface NotificationBadgeProps {
  /** Número de novos itens não visualizados */
  count: number;
  /** Classes CSS adicionais para ajuste fino de posicionamento */
  className?: string;
  /** Limite máximo de contagem antes de mostrar '+' (por defeito: 9) */
  max?: number;
}

/**
 * Componente reutilizável de Notification Badge no estilo padrão de aplicações como
 * Gmail, WhatsApp e Instagram.
 * 
 * - Círculo vermelho (#DC2626) com texto branco.
 * - Tamanho fixo de 20px (dentro do intervalo especificado de 18 a 22px).
 * - Posicionamento absoluto sobreposto no canto superior direito do elemento pai (ícone).
 * - Oculta-se completamente quando a contagem for 0 ou negativa.
 */
export function NotificationBadge({
  count,
  className,
  max = 9,
}: NotificationBadgeProps) {
  // Ocultar completamente se não houver novos itens por visualizar
  if (!count || count <= 0) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={cn(
        'absolute -top-[6px] -right-[6px] z-10',
        'flex items-center justify-center',
        'min-w-[20px] h-[20px] px-1',
        'bg-[#DC2626] text-white',
        'text-[10px] font-bold leading-none',
        'rounded-full ring-2 ring-white shadow-sm select-none pointer-events-none',
        'transition-transform animate-in zoom-in-75 duration-150',
        className
      )}
      aria-label={`${count} novos artigos não visualizados`}
    >
      {displayCount}
    </span>
  );
}
