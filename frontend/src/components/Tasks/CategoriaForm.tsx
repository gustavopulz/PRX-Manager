import React, { useState } from 'react';
import type { Categoria } from '../../types';

interface CategoriaFormProps {
  onSave: (categoria: Categoria) => void;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({ onSave }) => {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#2196f3');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ id: Date.now().toString(), nome, cor });
    setNome('');
    setCor('#2196f3');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
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
        className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded shadow"
      >
        Criar
      </button>
    </form>
  );
};
