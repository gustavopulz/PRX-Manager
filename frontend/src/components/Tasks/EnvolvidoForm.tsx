import React, { useState } from 'react';
import type { Envolvido } from '../../types';

interface EnvolvidoFormProps {
  onSave: (envolvido: Envolvido) => void;
}

export const EnvolvidoForm: React.FC<EnvolvidoFormProps> = ({ onSave }) => {
  const [nome, setNome] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ id: Date.now().toString(), nome });
    setNome('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do envolvido"
        className="border border-slate-700 bg-slate-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
        required
      />
      <button
        type="submit"
        className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded shadow"
      >
        Criar
      </button>
    </form>
  );
};
