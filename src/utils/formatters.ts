import { Category } from '../types/shopping';

/**
 * Retorna o tempo relativo ou data amigável em Português de Portugal.
 */
export function formatRelativeDate(isoDateString: string): string {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Agora mesmo';
  if (diffInMinutes < 60) return `Há ${diffInMinutes} min`;
  if (diffInHours === 1) return 'Há 1 hora';
  if (diffInHours < 24) return `Há ${diffInHours} horas`;
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `Há ${diffInDays} dias`;

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

/**
 * Cores e configurações visuais associadas a cada categoria.
 */
export interface CategoryMeta {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderHover: string;
  iconName: string;
  emoji: string;
}

export const CATEGORY_METADATA: Record<Category, CategoryMeta> = {
  [Category.LACTICINIOS]: {
    label: 'Lacticínios',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-700',
    borderHover: 'hover:border-blue-300',
    iconName: 'Milk',
    emoji: '🥛',
  },
  [Category.FRUTA]: {
    label: 'Fruta',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
    borderHover: 'hover:border-amber-300',
    iconName: 'Apple',
    emoji: '🍎',
  },
  [Category.LEGUMES]: {
    label: 'Legumes',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    borderHover: 'hover:border-emerald-300',
    iconName: 'Carrot',
    emoji: '🥕',
  },
  [Category.CARNE]: {
    label: 'Carne',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    borderHover: 'hover:border-rose-300',
    iconName: 'Beef',
    emoji: '🥩',
  },
  [Category.PEIXE]: {
    label: 'Peixe',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badgeText: 'text-cyan-700',
    borderHover: 'hover:border-cyan-300',
    iconName: 'Fish',
    emoji: '🐟',
  },
  [Category.CONGELADOS]: {
    label: 'Congelados',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-700',
    borderHover: 'hover:border-indigo-300',
    iconName: 'Snowflake',
    emoji: '🧊',
  },
  [Category.BEBIDAS]: {
    label: 'Bebidas',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-700',
    borderHover: 'hover:border-purple-300',
    iconName: 'Coffee',
    emoji: '🧃',
  },
  [Category.LIMPEZA]: {
    label: 'Limpeza',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    badgeText: 'text-teal-700',
    borderHover: 'hover:border-teal-300',
    iconName: 'Sparkles',
    emoji: '🧹',
  },
  [Category.HIGIENE]: {
    label: 'Higiene',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    badgeText: 'text-pink-700',
    borderHover: 'hover:border-pink-300',
    iconName: 'HeartHandshake',
    emoji: '🧴',
  },
  [Category.OUTROS]: {
    label: 'Outros',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    badgeText: 'text-slate-700',
    borderHover: 'hover:border-slate-300',
    iconName: 'Package',
    emoji: '📦',
  },
};
