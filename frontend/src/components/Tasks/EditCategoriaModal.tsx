import React, { useState } from 'react';
import Modal from '../Modal';
import type { Categoria } from '../../types';

interface EditCategoriaModalProps {
  categoria: Categoria | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoria: Categoria) => void;
}

const EditCategoriaModal: React.FC<EditCategoriaModalProps> = ({
  categoria,
  isOpen,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState(categoria?.nome || '');
  const [cor, setCor] = useState(categoria?.cor || '#2196f3');

  React.useEffect(() => {
    setNome(categoria?.nome || '');
    setCor(categoria?.cor || '#2196f3');
  }, [categoria]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoria) return;
    onSave({ ...categoria, nome, cor });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Categoria">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da categoria"
          className="border border-slate-700 bg-slate-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          required
        />
        <input
          type="color"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
          className="w-8 h-8 p-0 border border-slate-700 rounded"
        />
        <button
          type="submit"
          className="bg-blue-700 text-white px-3 py-1 rounded shadow"
        >
          Salvar
        </button>
      </form>
    </Modal>
  );
};

export default EditCategoriaModal;
