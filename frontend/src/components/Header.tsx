import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenSystemModal: () => void;
  onOpenMessageModal: () => void;
}

export default function Header({
  onOpenSystemModal,
  onOpenMessageModal,
}: HeaderProps) {
  return (
    <header className="bg-slate-900 px-4 sm:px-6 lg:px-20 2xl:px-40 border-b border-slate-700">
      <div className="flex items-center justify-between py-4">
        {/* Título + Botões */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">PRXLab - Manager</h1>

          <button
            onClick={onOpenSystemModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
          >
            Cadastrar Sistema
          </button>
          <button
            onClick={onOpenMessageModal}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
          >
            Enviar Mensagem
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex gap-4 text-sm">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/about" className="hover:underline">
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}
