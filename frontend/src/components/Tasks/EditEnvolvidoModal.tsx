import React, { useState } from 'react';
import Modal from '../Modal';
import type { Envolvido } from '../../types';

interface EditEnvolvidoModalProps {
  envolvido: Envolvido | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (envolvido: Envolvido) => void;
}

const EditEnvolvidoModal: React.FC<EditEnvolvidoModalProps> = ({
  envolvido,
  isOpen,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState(envolvido?.nome || '');

  React.useEffect(() => {
    setNome(envolvido?.nome || '');
  }, [envolvido]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!envolvido) return;
    onSave({ ...envolvido, nome });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Envolvido">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do envolvido"
          className="border border-slate-700 bg-slate-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          required
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

export default EditEnvolvidoModal;
