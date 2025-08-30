import React, { useState } from 'react';
import type { Checklist } from '../../types';

interface ChecklistCardProps {
  checklist: Checklist;
  onAddItem: (checklistId: string, descricao: string) => void;
  onToggleItem: (checklistId: string, itemId: string) => void;
  onDeleteItem: (checklistId: string, itemId: string) => void;
  onDeleteChecklist: (checklistId: string) => void;
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  checklist,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onDeleteChecklist,
}) => {
  const [descricao, setDescricao] = useState('');

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (descricao.trim()) {
      onAddItem(checklist.id, descricao);
      setDescricao('');
    }
  }

  return (
    <div className="border border-slate-700 bg-slate-900 rounded p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold">{checklist.titulo}</h4>
        <button
          onClick={() => onDeleteChecklist(checklist.id)}
          className="text-red-600"
        >
          Deletar Checklist
        </button>
      </div>
      <form onSubmit={handleAddItem} className="flex gap-2 mb-2">
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição do item"
          className="border border-slate-700 bg-slate-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Adicionar
        </button>
      </form>
      <ul>
        {checklist.itens.map((item) => (
          <li key={item.id} className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={item.feito}
              onChange={() => onToggleItem(checklist.id, item.id)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className={item.feito ? 'line-through' : ''}>
              {item.descricao}
            </span>
            <button
              onClick={() => onDeleteItem(checklist.id, item.id)}
              className="text-red-600 ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
