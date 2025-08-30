import React, { useState } from 'react';
import type { Task, Categoria, Envolvido, Flag } from '../../types';

interface TaskFormProps {
  categorias: Categoria[];
  envolvidos: Envolvido[];
  flags?: Flag[];
  onSave: (task: Task) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  categorias,
  envolvidos,
  flags,
  onSave,
}) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('Triagem');
  const [categoriaId, setCategoriaId] = useState('');
  const [flagId, setFlagId] = useState('');
  const [envolvidosIds, setEnvolvidosIds] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const categoria = categorias.find((c) => c.id === categoriaId);
    if (!categoria) {
      alert('Selecione uma categoria antes de criar a tarefa.');
      return;
    }
    const envolvidosSelecionados = envolvidos.filter((e) =>
      envolvidosIds.includes(e.id)
    );
    const now = new Date().toISOString();
    onSave({
      id: Date.now().toString(),
      titulo,
      descricao,
      status: status as any,
      categoria,
      flagId,
      envolvidos: envolvidosSelecionados,
      checklists: [],
      criadoEm: now,
      atualizadoEm: now,
    });
    setTitulo('');
    setDescricao('');
    setStatus('Triagem');
    setCategoriaId('');
    setEnvolvidosIds([]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg"
    >
      {/* Título */}
      <div className="flex flex-col gap-1">
        <label className="text-slate-300 text-sm font-medium">
          Título da tarefa
        </label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Digite um título"
          className="border border-slate-700 bg-slate-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      {/* Descrição */}
      <div className="flex flex-col gap-1">
        <label className="text-slate-300 text-sm font-medium">Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Detalhe a tarefa"
          rows={3}
          className="border border-slate-700 bg-slate-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Status e Categoria lado a lado */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-slate-300 text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-slate-700 bg-slate-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Triagem">Triagem</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Testes">Testes</option>
            <option value="Concluído">Concluído</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-slate-300 text-sm font-medium">
            Categoria
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="border border-slate-700 bg-slate-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Selecione a categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Flag selector (depende da categoria selecionada) */}
        <div className="flex flex-col gap-1">
          <label className="text-slate-300 text-sm font-medium">Flag</label>
          <select
            value={flagId}
            onChange={(e) => setFlagId(e.target.value)}
            className="border border-slate-700 bg-slate-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Nenhuma</option>
            {(() => {
              const cat = categorias.find((c) => c.id === categoriaId);
              const available = cat?.flags || flags || [];
              return available.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ));
            })()}
          </select>
        </div>
      </div>

      {/* Envolvidos */}
      <div className="flex flex-col gap-1">
        <label className="text-slate-300 text-sm font-medium">Envolvidos</label>
        <select
          multiple
          value={envolvidosIds}
          onChange={(e) =>
            setEnvolvidosIds(
              Array.from(e.target.selectedOptions, (o) => o.value)
            )
          }
          className="border border-slate-700 bg-slate-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[100px]"
        >
          {envolvidos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Botão */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow font-medium"
        >
          Criar Tarefa
        </button>
      </div>
    </form>
  );
};
