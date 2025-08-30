import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import type { Categoria, Task } from '../../types';

interface SelectCategoriaModalProps {
  categorias: Categoria[];
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoria: Categoria) => void;
}

const SelectCategoriaModal: React.FC<SelectCategoriaModalProps> = ({
  categorias,
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  const [categoriaId, setCategoriaId] = useState(task?.categoria?.id || '');

  useEffect(() => {
    setCategoriaId(task?.categoria?.id || '');
  }, [task]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!task || !categoriaId) return;
    const categoria = categorias.find((c) => c.id === categoriaId);
    if (categoria) {
      onSave(categoria);
      onClose();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alterar Categoria">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="border border-slate-700 bg-slate-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          disabled={!task}
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-700 text-white px-3 py-1 rounded shadow"
          disabled={!task || !categoriaId}
        >
          Salvar
        </button>
      </form>
    </Modal>
  );
};

export default SelectCategoriaModal;
