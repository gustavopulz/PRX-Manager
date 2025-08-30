import React, { useState } from 'react';
import type { Task } from '../../types';
import { ChecklistCard } from './ChecklistCard';

interface TaskDetailsProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onUpdateTask,
}) => {
  const [tab, setTab] = useState<'info' | 'checklists'>('info');
  const [checklistTitulo, setChecklistTitulo] = useState('');

  function handleAddChecklist() {
    if (checklistTitulo.trim()) {
      const newChecklist = {
        id: Date.now().toString(),
        titulo: checklistTitulo,
        itens: [],
      };
      onUpdateTask({ ...task, checklists: [...task.checklists, newChecklist] });
      setChecklistTitulo('');
    }
  }

  function handleAddItem(checklistId: string, descricao: string) {
    const updated = task.checklists.map((c) =>
      c.id === checklistId
        ? {
            ...c,
            itens: [
              ...c.itens,
              { id: Date.now().toString(), descricao, feito: false },
            ],
          }
        : c
    );
    onUpdateTask({ ...task, checklists: updated });
  }

  function handleToggleItem(checklistId: string, itemId: string) {
    const updated = task.checklists.map((c) =>
      c.id === checklistId
        ? {
            ...c,
            itens: c.itens.map((i) =>
              i.id === itemId ? { ...i, feito: !i.feito } : i
            ),
          }
        : c
    );
    onUpdateTask({ ...task, checklists: updated });
  }

  function handleDeleteItem(checklistId: string, itemId: string) {
    const updated = task.checklists.map((c) =>
      c.id === checklistId
        ? { ...c, itens: c.itens.filter((i) => i.id !== itemId) }
        : c
    );
    onUpdateTask({ ...task, checklists: updated });
  }

  function handleDeleteChecklist(checklistId: string) {
    const updated = task.checklists.filter((c) => c.id !== checklistId);
    onUpdateTask({ ...task, checklists: updated });
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTab('info')}
          className={tab === 'info' ? 'font-bold underline' : ''}
        >
          Informações
        </button>
        <button
          onClick={() => setTab('checklists')}
          className={tab === 'checklists' ? 'font-bold underline' : ''}
        >
          Checklists
        </button>
      </div>
      {tab === 'info' ? (
        <div>
          <div>
            <b>ID:</b> {task.id}
          </div>
          <div>
            <b>Título:</b> {task.titulo}
          </div>
          <div>
            <b>Descrição:</b> {task.descricao}
          </div>
          <div>
            <b>Status:</b> {task.status}
          </div>
          <div>
            <b>Categoria:</b>{' '}
            <span
              style={{
                background: task.categoria.cor,
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              {task.categoria.nome}
            </span>
          </div>
          <div>
            <b>Envolvidos:</b> {task.envolvidos.map((e) => e.nome).join(', ')}
          </div>
          <div>
            <b>Criado em:</b> {task.criadoEm}
          </div>
          <div>
            <b>Atualizado em:</b> {task.atualizadoEm}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex gap-2 items-center">
            <input
              value={checklistTitulo}
              onChange={(e) => setChecklistTitulo(e.target.value)}
              placeholder="Título do checklist"
              className="border px-2 py-1"
            />
            <button
              onClick={handleAddChecklist}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Adicionar Checklist
            </button>
          </div>
          {task.checklists.map((checklist) => (
            <ChecklistCard
              key={checklist.id}
              checklist={checklist}
              onAddItem={handleAddItem}
              onToggleItem={handleToggleItem}
              onDeleteItem={handleDeleteItem}
              onDeleteChecklist={handleDeleteChecklist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
