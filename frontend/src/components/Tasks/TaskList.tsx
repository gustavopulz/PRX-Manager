import React from 'react';
import type { Task, Flag } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onShowDetails: (task: Task) => void;
  onCreateCategoria: () => void;
  onCreateEnvolvido: () => void;
  onCreateTask: () => void;
  onOpenFlag?: () => void;
  flags?: Flag[];
  onAssignFlag?: (task: Task) => void;
}

// Normaliza texto (remove acento e deixa minúsculo)
const normalize = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onShowDetails,
  onCreateCategoria,
  onCreateEnvolvido,
  onCreateTask,
  onOpenFlag,
  flags,
  onAssignFlag,
}) => {
  const statusColors: Record<string, string> = {
    triagem: 'bg-slate-500 text-white',
    'em andamento': 'bg-blue-600 text-white',
    testes: 'bg-cyan-500 text-white',
    'testes reprovados': 'bg-red-600 text-white',
    finalizado: 'bg-green-600 text-white',
    concluido: 'bg-green-600 text-white',
  };

  return (
    <div className="w-full">
      {/* Header com título e botões */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Gerenciador de Tarefas
        </h2>
        <div className="flex gap-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
            onClick={onCreateCategoria}
          >
            + Categoria
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
            onClick={onCreateEnvolvido}
          >
            + Envolvido
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm font-medium"
            onClick={() => onOpenFlag && onOpenFlag()}
          >
            + Flags
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
            onClick={onCreateTask}
          >
            + Nova Tarefa
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <thead className="bg-slate-800/80">
            <tr>
              {[
                'Status',
                'Título',
                'Categoria',
                'Flag',
                'Envolvidos',
                'Progresso',
                'Ações',
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-semibold text-slate-300 text-left text-sm uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {tasks.map((task) => {
              const checklists = Array.isArray(task.checklists)
                ? task.checklists
                : [];
              const total = checklists.reduce(
                (acc, c) => acc + c.itens.length,
                0
              );
              const done = checklists.reduce(
                (acc, c) => acc + c.itens.filter((i) => i.feito).length,
                0
              );
              const progress = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* Status */}
                  <td className="px-4 py-3">
                    <button
                      className={`px-3 py-1 rounded-md text-xs font-medium shadow-sm ${
                        statusColors[normalize(task.status)] ||
                        'bg-slate-700 text-white'
                      }`}
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent('editFila', { detail: task })
                        )
                      }
                    >
                      {task.status}
                    </button>
                  </td>

                  {/* Título */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onShowDetails(task)}
                      className="text-white hover:text-blue-400 font-medium"
                    >
                      {task.titulo}
                    </button>
                  </td>

                  {/* Categoria */}
                  <td className="px-4 py-3">
                    <button
                      className="rounded-md px-3 py-1 text-xs font-medium shadow-sm"
                      style={{
                        background: task.categoria.cor,
                        color: '#fff',
                      }}
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent('editCategoria', { detail: task })
                        )
                      }
                    >
                      {task.categoria.nome}
                    </button>
                  </td>

                  {/* Flag (clicável para atribuir/alterar) */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onAssignFlag && onAssignFlag(task)}
                      className="rounded px-1 py-0.5"
                    >
                      {task.flagId ? (
                        (() => {
                          const flag =
                            task.categoria.flags?.find(
                              (f) => f.id === task.flagId
                            ) || flags?.find((f) => f.id === task.flagId);
                          return flag ? (
                            <span
                              className="px-2 py-1 rounded text-xs font-semibold"
                              style={{ background: flag.cor, color: '#fff' }}
                            >
                              {flag.nome}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-sm">—</span>
                          );
                        })()
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </button>
                  </td>

                  {/* Envolvidos */}
                  <td className="px-4 py-3">
                    <button
                      className="flex items-center gap-2"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent('editEnvolvidos', { detail: task })
                        )
                      }
                    >
                      {task.envolvidos && Array.isArray(task.envolvidos)
                        ? task.envolvidos.map((e, idx) => (
                            <span
                              key={idx}
                              title={e.nome}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 text-white text-xs font-bold"
                            >
                              {e.nome.substring(0, 3)}
                            </span>
                          ))
                        : '—'}
                    </button>
                  </td>

                  {/* Progresso */}
                  <td className="px-4 py-3 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-300">
                        {progress}%
                      </span>
                    </div>
                  </td>
                  {/* Ações */}
                  <td className="px-4 py-3 space-x-3 text-right">
                    <button
                      onClick={() => onEdit(task)}
                      className="hover:opacity-70 transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="hover:opacity-70 transition"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
