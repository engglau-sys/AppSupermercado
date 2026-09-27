import { useState } from 'react';
import { User, Family } from '../../types/shopping';
import { UserSwitcherModal } from './UserSwitcherModal';
import {
  ShoppingCart,
  LayoutDashboard,
  Users,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { Button } from '../common/Button';
import { NotificationBadge } from '../common/NotificationBadge';
import { cn } from '../../utils/cn';

export interface HeaderProps {
  currentTab: 'dashboard' | 'shopping';
  onSelectTab: (tab: 'dashboard' | 'shopping') => void;
  currentUser: User;
  family: Family;
  members: User[];
  onSelectUser: (userId: string) => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
  unviewedCount: number;
}

export function Header({
  currentTab,
  onSelectTab,
  currentUser,
  family,
  members,
  onSelectUser,
  onOpenAddModal,
  onResetData,
  unviewedCount,
}: HeaderProps) {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logótipo & Marca */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => onSelectTab('dashboard')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-sm group-hover:bg-[#256629] transition-colors">
                  <ShoppingCart className="w-5 h-5 stroke-[2.3]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">
                      App<span className="text-[#2E7D32]">Supermercado</span>
                    </span>
                    <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded">
                      MVP V1
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium hidden xs:block">
                    {family.name}
                  </p>
                </div>
              </div>

              {/* Separadores Desktop */}
              <nav className="hidden md:flex items-center gap-1 ml-6 pl-6 border-l border-slate-200">
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all',
                    currentTab === 'dashboard'
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => onSelectTab('shopping')}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative',
                    currentTab === 'shopping'
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Lista de Compras</span>
                  <NotificationBadge count={unviewedCount} />
                </button>
              </nav>
            </div>

            {/* Ações da Direita */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botão de repor dados mock */}
              <button
                onClick={onResetData}
                title="Repor lista inicial de demonstração"
                className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repor Demo</span>
              </button>

              {/* Botão Adicionar Artigo (Visível em Desktop) */}
              <Button
                onClick={onOpenAddModal}
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Adicionar Artigo</span>
              </Button>

              {/* Seletor do Utilizador Ativo (Glaucia) */}
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
                title="Trocar membro da família"
              >
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" />
                    <span>Trocar</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de troca de utilizador */}
      <UserSwitcherModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        members={members}
        activeUserId={currentUser.id}
        onSelectUser={onSelectUser}
      />
    </>
  );
}
