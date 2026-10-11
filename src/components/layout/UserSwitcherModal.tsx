import { User } from '../../types/shopping';
import { Modal } from '../common/Modal';
import { Check, UserCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  activeUserId: string;
  onSelectUser: (userId: string) => void;
}

export function UserSwitcherModal({
  isOpen,
  onClose,
  members,
  activeUserId,
  onSelectUser,
}: UserSwitcherModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Membros da Família"
      description="Alterna entre membros da família para simular quem adiciona ou compra artigos."
      maxWidth="sm"
    >
      <div className="space-y-2.5">
        {members.map((member) => {
          const isActive = member.id === activeUserId;
          return (
            <button
              key={member.id}
              onClick={() => {
                onSelectUser(member.id);
                onClose();
              }}
              className={cn(
                'w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 text-left',
                isActive
                  ? 'border-[#2E7D32] bg-[#E8F5E9]/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.avatar || member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800 text-sm">
                      {member.name}
                    </span>
                    {isActive && (
                      <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded font-medium">
                        Ativo
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">Membro da Família</span>
                </div>
              </div>

              {isActive ? (
                <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <UserCircle2 className="w-5 h-5 text-slate-300" />
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
