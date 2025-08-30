import React, { useState } from 'react';
import Modal from '../Modal';
import type { Flag } from '../../types';

interface FlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  flags: Flag[];
  onSave: (flags: Flag[]) => void;
}

const FlagModal: React.FC<FlagModalProps> = ({
  isOpen,
  onClose,
  flags,
  onSave,
}) => {
  const [localFlags, setLocalFlags] = useState<Flag[]>(
    flags && flags.length > 0
      ? flags
      : [{ id: Date.now().toString(), nome: '', cor: '#3b82f6', webhook: '' }]
  );

  function handleFlagChange(idx: number, field: keyof Flag, value: string) {
    setLocalFlags((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f))
    );
  }

  function handleRemoveFlag(idx: number) {
    setLocalFlags((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      return updated.length > 0
        ? updated
        : [
            {
              id: Date.now().toString(),
              nome: '',
              cor: '#3b82f6',
              webhook: '',
            },
          ];
    });
  }

  function handleAddFlag() {
    setLocalFlags((prev) => [
      ...prev,
      { id: Date.now().toString(), nome: '', cor: '#3b82f6', webhook: '' },
    ]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(localFlags);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurar Flags">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Lista de flags */}
        <div className="flex flex-col gap-4">
          {localFlags.map((flag, idx) => (
            <div
              key={flag.id}
              className="flex flex-col gap-2 bg-slate-800/60 p-3 rounded-lg border border-slate-700"
            >
              <input
                value={flag.nome}
                onChange={(e) => handleFlagChange(idx, 'nome', e.target.value)}
                placeholder="Nome da flag"
                className="border border-slate-700 bg-slate-900 text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />

              <input
                type="color"
                value={flag.cor}
                onChange={(e) => handleFlagChange(idx, 'cor', e.target.value)}
                className="w-12 h-10 p-0 border border-slate-700 rounded cursor-pointer"
              />

              <input
                value={flag.webhook}
                onChange={(e) =>
                  handleFlagChange(idx, 'webhook', e.target.value)
                }
                placeholder="Webhook da flag"
                className="border border-slate-700 bg-slate-900 text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />

              <button
                type="button"
                className="self-end bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium shadow"
                onClick={() => handleRemoveFlag(idx)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="flex justify-between items-center gap-3">
          <div>
            <button
              type="button"
              onClick={handleAddFlag}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow font-medium"
            >
              Adicionar Flag
            </button>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow font-medium"
            >
              Salvar
            </button>
            <button
              type="button"
              className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-md shadow font-medium"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default FlagModal;
