import React, { useState } from 'react';
import Modal from '../Modal';
import type { TaskStatus, Task } from '../../types';

interface EditFilaModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: TaskStatus) => void;
}

const statusOptions: TaskStatus[] = [
  'Triagem',
  'Em Andamento',
  'Testes',
  'Concluído',
];

const EditFilaModal: React.FC<EditFilaModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'Triagem');

  React.useEffect(() => {
    setStatus(task?.status || 'Triagem');
  }, [task]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(status);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Fila">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="border border-slate-700 bg-slate-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
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

export default EditFilaModal;
