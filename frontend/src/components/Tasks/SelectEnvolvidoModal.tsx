import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import type { Envolvido, Task } from '../../types';

interface SelectEnvolvidoModalProps {
  envolvidos: Envolvido[];
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (envolvidos: Envolvido[]) => void;
}

const SelectEnvolvidoModal: React.FC<SelectEnvolvidoModalProps> = ({
  envolvidos,
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  const [envolvidosIds, setEnvolvidosIds] = useState<string[]>(
    task?.envolvidos?.map((e) => e.id) || []
  );

  useEffect(() => {
    setEnvolvidosIds(task?.envolvidos?.map((e) => e.id) || []);
  }, [task]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!task) return;
    const selecionados = envolvidos.filter((e) => envolvidosIds.includes(e.id));
    onSave(selecionados);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alterar Envolvidos">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          multiple
          value={envolvidosIds}
          onChange={(e) =>
            setEnvolvidosIds(
              Array.from(e.target.selectedOptions, (o) => o.value)
            )
          }
          className="border border-slate-700 bg-slate-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          disabled={!task}
        >
          {envolvidos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-700 text-white px-3 py-1 rounded shadow"
          disabled={!task}
        >
          Salvar
        </button>
      </form>
    </Modal>
  );
};

export default SelectEnvolvidoModal;
