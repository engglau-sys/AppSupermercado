import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

    const variants = {
      primary:
        'bg-[#2E7D32] hover:bg-[#256629] text-white shadow-sm focus:ring-[#2E7D32]',
      secondary:
        'bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] focus:ring-[#2E7D32]',
      outline:
        'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:ring-[#2E7D32]',
      ghost:
        'hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-300',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 min-h-[34px] gap-1.5',
      md: 'text-sm px-4 py-2.5 min-h-[42px] gap-2',
      lg: 'text-base px-5 py-3 min-h-[48px] gap-2.5 font-semibold',
      icon: 'p-2 min-h-[40px] min-w-[40px] rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
