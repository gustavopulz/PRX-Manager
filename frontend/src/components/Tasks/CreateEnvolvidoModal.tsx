import React, { useState } from 'react';
import Modal from '../Modal';
import type { Envolvido } from '../../types';
import { getEnvolvidosFromFirestore } from '../../database/api';
import { saveEnvolvidoToFirestore } from '../../database/api';
import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../database/firestore';

interface CreateEnvolvidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (envolvido: Envolvido) => void;
}

const CreateEnvolvidoModal: React.FC<CreateEnvolvidoModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState('');
  const [envolvidos, setEnvolvidos] = useState<Envolvido[]>([]);
  const [editEnvolvido, setEditEnvolvido] = useState<Envolvido | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      getEnvolvidosFromFirestore().then(setEnvolvidos);
    }
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editEnvolvido) {
      const updated = { ...editEnvolvido, nome };
      saveEnvolvidoToFirestore(updated).then(() => {
        setEnvolvidos((prev) =>
          prev.map((env) => (env.id === updated.id ? updated : env))
        );
        setEditEnvolvido(null);
        setNome('');
      });
    } else {
      const novo = { id: Date.now().toString(), nome };
      saveEnvolvidoToFirestore(novo).then(() => {
        setEnvolvidos((prev) => [...prev, novo]);
        onSave(novo);
        setNome('');
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Envolvido">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do envolvido"
          className="border border-slate-700 bg-slate-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          required
        />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-700 text-white px-3 py-1 rounded shadow"
          >
            {editEnvolvido ? 'Salvar' : 'Criar'}
          </button>
          <button
            type="button"
            className="bg-slate-700 text-white px-3 py-1 rounded shadow"
            onClick={() => {
              setNome('');
              setEditEnvolvido(null);
              onClose();
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
      <div className="mt-4">
        <h3 className="font-semibold mb-2 text-white">Envolvidos</h3>
        <ul className="space-y-2">
          {envolvidos.map((env) => (
            <li key={env.id} className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-slate-700 text-white">
                {env.nome}
              </span>
              <button
                className="bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                onClick={() => {
                  setEditEnvolvido(env);
                  setNome(env.nome);
                }}
              >
                Editar
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                onClick={async () => {
                  await deleteDoc(doc(firestore, 'manager_envolvidos', env.id));
                  setEnvolvidos((prev) => prev.filter((e) => e.id !== env.id));
                }}
              >
                Deletar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default CreateEnvolvidoModal;
