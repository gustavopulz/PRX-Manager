import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>

        {/* Título */}
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {/* Conteúdo */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
