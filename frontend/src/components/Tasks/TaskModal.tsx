import React from 'react';
import type { Task } from '../../types';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  onClose,
  onEdit,
}) => {
  if (!task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-2 text-white">{task.titulo}</h2>
        <p className="mb-4 text-slate-200">{task.descricao}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onEdit(task)}
            className="px-4 py-2 bg-blue-700 text-white rounded"
          >
            Ver mais/Editar
          </button>
        </div>
      </div>
    </div>
  );
};
