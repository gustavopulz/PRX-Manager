import React, { useEffect, useState } from 'react';
import SelectCategoriaModal from '../components/Tasks/SelectCategoriaModal';
import SelectEnvolvidoModal from '../components/Tasks/SelectEnvolvidoModal';
import EditFilaModal from '../components/Tasks/EditFilaModal';
import { TaskList } from '../components/Tasks/TaskList';
import { TaskModal } from '../components/Tasks/TaskModal';
import { TaskForm } from '../components/Tasks/TaskForm';
import CreateCategoriaModal from '../components/Tasks/CreateCategoriaModal';
import CreateEnvolvidoModal from '../components/Tasks/CreateEnvolvidoModal';
import { TaskDetails } from '../components/Tasks/TaskDetails';
import FlagModal from '../components/Tasks/FlagModal';
import type { Flag, Task, Categoria, Envolvido } from '../types';
import {
  getTasksFromFirestore,
  saveTaskToFirestore,
  deleteTaskFromFirestore,
  getCategoriasFromFirestore,
  getEnvolvidosFromFirestore,
  updateTaskInFirestore,
} from '../database/api';

// Função para enviar mensagem ao Discord — prioriza webhook da flag, se existir
async function sendDiscordWebhook(task: Task, flagsList: Flag[]) {
  // Tenta webhook da flag (primeiro nas flags da categoria, depois nas flags globais)
  let webhook: string | undefined;
  if (task.flagId) {
    webhook =
      task.categoria?.flags?.find((f) => f.id === task.flagId)?.webhook ||
      flagsList?.find((f) => f.id === task.flagId)?.webhook;
  }

  // Fallback para webhook da categoria
  if (!webhook) webhook = task.categoria?.webhook;
  if (!webhook) return;

  // Busca nome da flag para incluir no embed (opcional)
  const flagName = task.flagId
    ? task.categoria?.flags?.find((f) => f.id === task.flagId)?.nome ||
      flagsList?.find((f) => f.id === task.flagId)?.nome
    : undefined;

  // Calcula progresso a partir dos checklists (percentual)
  const totalItems =
    task.checklists?.reduce((acc, cl) => acc + (cl.itens?.length || 0), 0) || 0;
  const doneItems =
    task.checklists?.reduce(
      (acc, cl) => acc + (cl.itens?.filter((it) => it.feito).length || 0),
      0
    ) || 0;
  const progress =
    totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);

  // Cor do embed baseada no status (hex as int)
  const statusColorMap: Record<string, number> = {
    Triagem: parseInt('F97316', 16), // orange
    'Em Andamento': parseInt('3B82F6', 16), // blue
    Testes: parseInt('FBBF24', 16), // yellow
    Concluído: parseInt('10B981', 16), // green
  };
  const color = statusColorMap[task.status] || parseInt('374151', 16);

  const envolvidosText =
    task.envolvidos && task.envolvidos.length > 0
      ? task.envolvidos.map((e) => e.nome).join(', ')
      : '—';

  const body = {
    embeds: [
      {
        title: `#${task.id} - ${task.titulo}`,
        description:
          `${flagName || 'Nenhuma'}\n\n` +
          `Status: ${task.status} (Progresso: ${progress}%)\n` +
          `Descrição: ${task.descricao || '—'}\n` +
          `Categoria: ${task.categoria?.nome || '—'}\n` +
          `Envolvidos: ${envolvidosText}`,
        color,
      },
    ],
  };
  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('Erro ao enviar webhook:', err);
  }
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showConcluidos, setShowConcluidos] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [envolvidos, setEnvolvidos] = useState<Envolvido[]>([]);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showCreateCategoriaModal, setShowCreateCategoriaModal] =
    useState(false);
  const [showCreateEnvolvidoModal, setShowCreateEnvolvidoModal] =
    useState(false);
  const [selectCategoriaTask, setSelectCategoriaTask] = useState<Task | null>(
    null
  );
  const [selectEnvolvidoTask, setSelectEnvolvidoTask] = useState<Task | null>(
    null
  );
  const [editFilaTask, setEditFilaTask] = useState<Task | null>(null);
  const [assignFlagTask, setAssignFlagTask] = useState<Task | null>(null);
  const [assignFlagId, setAssignFlagId] = useState<string>('');

  // Listeners para eventos de edição
  useEffect(() => {
    function handleSelectCategoria(e: any) {
      setSelectCategoriaTask(e.detail);
    }
    function handleSelectEnvolvidos(e: any) {
      setSelectEnvolvidoTask(e.detail);
    }
    function handleEditFila(e: any) {
      setEditFilaTask(e.detail);
    }
    function handleOpenFlagModal() {
      setShowFlagModal(true);
    }
    window.addEventListener('editCategoria', handleSelectCategoria);
    window.addEventListener('editEnvolvidos', handleSelectEnvolvidos);
    window.addEventListener('editFila', handleEditFila);
    window.addEventListener('openFlagModal', handleOpenFlagModal as any);
    return () => {
      window.removeEventListener('editCategoria', handleSelectCategoria);
      window.removeEventListener('editEnvolvidos', handleSelectEnvolvidos);
      window.removeEventListener('editFila', handleEditFila);
      window.removeEventListener('openFlagModal', handleOpenFlagModal as any);
    };
  }, []);

  function handleUpdateFila(status: any) {
    if (!editFilaTask) return;
    const arquivada = status === 'Concluído';
    const updatedTask = { ...editFilaTask, status, arquivada };
    updateTaskInFirestore(updatedTask.id, updatedTask).then(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      setEditFilaTask(null);
    });
  }

  useEffect(() => {
    getTasksFromFirestore().then(setTasks);
    getCategoriasFromFirestore().then(setCategorias);
    getEnvolvidosFromFirestore().then(setEnvolvidos);
    // Carrega flags
    import('../database/api').then(({ getFlagsFromFirestore }) => {
      getFlagsFromFirestore().then((f) => setFlags(f || []));
    });
  }, []);

  function handleSaveTask(task: Task) {
    const arquivada = task.status === 'Concluído';
    const newTask = { ...task, arquivada };
    saveTaskToFirestore(newTask).then(() => {
      setTasks((prev) => [...prev, newTask]);
      // Envia webhook apenas na criação
      sendDiscordWebhook(newTask, flags);
    });
  }

  function handleEditTask(task: Task) {
    setSelectedTask(task);
    setShowDetails(true);
  }

  function handleDeleteTask(id: string) {
    deleteTaskFromFirestore(id).then(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });
  }

  function handleShowDetails(task: Task) {
    setSelectedTask(task);
    setShowDetails(false);
  }

  function handleSelectCategoriaSave(categoria: Categoria) {
    if (!selectCategoriaTask) return;
    const updatedTask = { ...selectCategoriaTask, categoria };
    saveTaskToFirestore(updatedTask).then(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      setSelectCategoriaTask(null);
    });
  }

  function handleSelectEnvolvidoSave(envolvidos: Envolvido[]) {
    if (!selectEnvolvidoTask) return;
    const updatedTask = { ...selectEnvolvidoTask, envolvidos };
    saveTaskToFirestore(updatedTask).then(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      setSelectEnvolvidoTask(null);
    });
  }

  function handleUpdateTask(task: Task) {
    updateTaskInFirestore(task.id, task).then(() => {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      setSelectedTask(task);
    });
  }

  return (
    <div className="py-6">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${showConcluidos ? 'bg-green-700 text-white' : 'bg-slate-700 text-white'}`}
          onClick={() => setShowConcluidos(false)}
        >
          Tarefas Ativas
        </button>
        <button
          className={`px-4 py-2 rounded ${showConcluidos ? 'bg-green-500 text-white' : 'bg-slate-700 text-white'}`}
          onClick={() => setShowConcluidos(true)}
        >
          Concluídas/Arquivadas
        </button>
      </div>
      <div className="mt-4 bg-slate-800 rounded-xl p-4 shadow">
        <TaskList
          tasks={
            showConcluidos
              ? tasks.filter((t) => t.arquivada)
              : tasks.filter((t) => !t.arquivada)
          }
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onShowDetails={handleShowDetails}
          onCreateCategoria={() => setShowCreateCategoriaModal(true)}
          onCreateEnvolvido={() => setShowCreateEnvolvidoModal(true)}
          onCreateTask={() => setShowCreateModal(true)}
          onOpenFlag={() => setShowFlagModal(true)}
          flags={flags}
          onAssignFlag={(task) => {
            setAssignFlagTask(task);
            setAssignFlagId(task.flagId || '');
          }}
        />
      </div>

      {/* Modal de criação de categoria */}
      <CreateCategoriaModal
        isOpen={showCreateCategoriaModal}
        onClose={() => setShowCreateCategoriaModal(false)}
        onSave={(categoria) => {
          setCategorias((prev) => [...prev, categoria]);
          setShowCreateCategoriaModal(false);
        }}
      />

      {/* Modal de criação de envolvido */}
      <CreateEnvolvidoModal
        isOpen={showCreateEnvolvidoModal}
        onClose={() => setShowCreateEnvolvidoModal(false)}
        onSave={(envolvido) => {
          setEnvolvidos((prev) => [...prev, envolvido]);
          setShowCreateEnvolvidoModal(false);
        }}
      />

      {/* Modal de criação de tarefa */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Criar Tarefa
            </h2>
            <TaskForm
              categorias={categorias}
              envolvidos={envolvidos}
              flags={flags}
              onSave={(task) => {
                handleSaveTask(task);
                setShowCreateModal(false);
              }}
            />
            <button
              onClick={() => setShowCreateModal(false)}
              className="mt-4 px-4 py-2 bg-slate-700 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedTask && !showDetails && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={handleEditTask}
        />
      )}

      {/* Modal de edição */}
      {selectedTask && showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <TaskDetails task={selectedTask} onUpdateTask={handleUpdateTask} />
            <button
              onClick={() => setShowDetails(false)}
              className="mt-4 px-4 py-2 bg-slate-700 text-white rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <SelectCategoriaModal
        categorias={categorias}
        task={selectCategoriaTask}
        isOpen={!!selectCategoriaTask}
        onClose={() => setSelectCategoriaTask(null)}
        onSave={handleSelectCategoriaSave}
      />

      <SelectEnvolvidoModal
        envolvidos={envolvidos}
        task={selectEnvolvidoTask}
        isOpen={!!selectEnvolvidoTask}
        onClose={() => setSelectEnvolvidoTask(null)}
        onSave={handleSelectEnvolvidoSave}
      />

      <EditFilaModal
        task={editFilaTask}
        isOpen={!!editFilaTask}
        onClose={() => setEditFilaTask(null)}
        onSave={handleUpdateFila}
      />

      {/* Flag modal */}
      <FlagModal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        flags={flags}
        onSave={(newFlags) => {
          setFlags(newFlags);
          setShowFlagModal(false);
          // Persiste flags no Firestore
          import('../database/api').then(({ saveFlagToFirestore }) => {
            newFlags.forEach((f) => saveFlagToFirestore(f));
          });
        }}
      />

      {/* Assign flag modal */}
      {assignFlagTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Atribuir Flag
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 text-sm">Flag</label>
              <select
                value={assignFlagId}
                onChange={(e) => setAssignFlagId(e.target.value)}
                className="border border-slate-700 bg-slate-800 text-white px-3 py-2 rounded-md"
              >
                <option value="">Nenhuma</option>
                {(() => {
                  const catFlags = assignFlagTask.categoria.flags || [];
                  const available = [
                    ...catFlags,
                    ...flags.filter(
                      (f) => !catFlags.find((cf) => cf.id === f.id)
                    ),
                  ];
                  return available.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ));
                })()}
              </select>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-4 py-2 bg-slate-700 text-white rounded"
                onClick={() => setAssignFlagTask(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  if (!assignFlagTask) return;
                  const updated = {
                    ...assignFlagTask,
                    flagId: assignFlagId || undefined,
                  } as Task;
                  updateTaskInFirestore(updated.id, updated).then(() => {
                    setTasks((prev) =>
                      prev.map((t) => (t.id === updated.id ? updated : t))
                    );
                    setAssignFlagTask(null);
                  });
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
