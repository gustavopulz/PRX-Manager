import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../database/firestore';
import React, { useState } from 'react';
import Modal from '../Modal';
import type { Categoria } from '../../types';
import {
  saveCategoriaToFirestore,
  getCategoriasFromFirestore,
} from '../../database/api';

interface CreateCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoria: Categoria) => void;
}

const CreateCategoriaModal: React.FC<CreateCategoriaModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#2196f3');
  const [webhook, setWebhook] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editCategoria) {
      // Editando
      const updated = { ...editCategoria, nome, cor, webhook };
      await saveCategoriaToFirestore(updated);
      setCategorias((prev) =>
        prev.map((cat) => (cat.id === updated.id ? updated : cat))
      );
      setEditCategoria(null);
      setNome('');
      setCor('#2196f3');
      setWebhook('');
    } else {
      // Criando nova
      const nova = { id: Date.now().toString(), nome, cor, webhook };
      await saveCategoriaToFirestore(nova);
      setCategorias((prev) => [...prev, nova]);
      onSave(nova);
      setNome('');
      setCor('#2196f3');
      setWebhook('');
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      getCategoriasFromFirestore().then(setCategorias);
    }
  }, [isOpen]);

  // Remove setFlags and its usage, as there is no flags state in this component.

  // Remove setFlags and its usage, as there is no flags state in this component.

  // Remove setFlags and its usage, as there is no flags state in this component.

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Categoria">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da categoria"
            className="border border-slate-700 bg-slate-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 flex-1"
            required
          />
          <input
            type="color"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
            className="w-10 h-10 p-0 border border-slate-700 rounded"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-700 text-white px-3 py-1 rounded shadow"
          >
            {editCategoria ? 'Salvar' : 'Criar'}
          </button>
          <button
            type="button"
            className="bg-slate-700 text-white px-3 py-1 rounded shadow"
            onClick={() => {
              setNome('');
              setCor('#2196f3');
              setEditCategoria(null);
              onClose();
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
      <div className="mt-4">
        <h3 className="font-semibold mb-2 text-white">Categorias</h3>
        {/* Flags are gerenciadas pelo painel principal agora */}
        <ul className="space-y-2">
          {categorias.map((cat) => (
            <li key={cat.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-1 rounded"
                  style={{ background: cat.cor, color: '#fff' }}
                >
                  {cat.nome}
                </span>
                <button
                  className="bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => {
                    setEditCategoria(cat);
                    setNome(cat.nome);
                    setCor(cat.cor);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                  onClick={async () => {
                    await deleteDoc(
                      doc(firestore, 'manager_categorias', cat.id)
                    );
                    setCategorias((prev) =>
                      prev.filter((c) => c.id !== cat.id)
                    );
                  }}
                >
                  Deletar
                </button>
              </div>
              {/* Exibir flags da categoria */}
              {cat.flags && cat.flags.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-1">
                  {cat.flags.map((flag) => (
                    <span
                      key={flag.id}
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ background: flag.cor, color: '#fff' }}
                    >
                      {flag.nome}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default CreateCategoriaModal;
