import React, { useState } from 'react';
import { Category, CreateShoppingItemDTO } from '../../types/shopping';
import { CATEGORY_METADATA } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    item: Omit<CreateShoppingItemDTO, 'familyId' | 'createdBy'> & {
      createdBy?: string;
    }
  ) => Promise<unknown>;
  currentUserName: string;
}

const COMMON_UNITS = ['un', 'kg', 'g', 'l', 'emb', 'cx', 'pct'];

export function AddItemModal({
  isOpen,
  onClose,
  onAdd,
  currentUserName,
}: AddItemModalProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('un');
  const [category, setCategory] = useState<Category>(Category.FRUTA);
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setQuantity(1);
    setUnit('un');
    setCategory(Category.FRUTA);
    setNotes('');
    setNameError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError('Indica o nome do produto');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAdd({
        name: name.trim(),
        quantity: Math.max(0.1, Number(quantity) || 1),
        unit,
        category,
        notes: notes.trim() || undefined,
      });
      resetForm();
      onClose();
    } catch (err) {
      console.error('Erro ao adicionar:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickQuantity = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Adicionar Produto"
      description={`A adicionar à lista familiar por ${currentUserName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome do Produto */}
        <div>
          <Input
            label="Nome do Produto *"
            placeholder="Ex: Leite Meio Gordo, Pão de Forma, Bananas..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError('');
            }}
            error={nameError}
            autoFocus
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          />
        </div>

        {/* Quantidade e Unidade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Quantidade
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 w-full justify-between">
                <button
                  type="button"
                  onClick={() => handleQuickQuantity(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 text-center font-bold text-slate-800 bg-transparent focus:outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => handleQuickQuantity(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Unidade */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Unidade
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_UNITS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all',
                    unit === u
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seleção de Categoria (Enum Fixo) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Categoria * (Enum Fixo)
            </label>
            <span className="text-[11px] text-slate-400">Obrigatório</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 sm:max-h-none overflow-y-auto p-1">
            {Object.values(Category).map((cat) => {
              const meta = CATEGORY_METADATA[cat];
              const isSelected = category === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-150',
                    isSelected
                      ? 'bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <span className="text-xl mb-1">{meta.emoji}</span>
                  <span
                    className={cn(
                      'text-xs font-semibold leading-tight truncate w-full',
                      isSelected ? 'text-[#2E7D32]' : 'text-slate-700'
                    )}
                  >
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notas Opcionais */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Notas ou Marca (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ex: Marca Mimosa, maduras, embalagem grande..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="min-w-[130px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Adicionar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
