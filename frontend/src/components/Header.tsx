import { Link } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 sm:px-6 lg:px-20 2xl:px-40 border-b border-slate-700 shadow-md">
      <div className="flex items-center justify-between py-4">
        {/* Título */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            P
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            PRXLab <span className="text-blue-500">Manager</span>
          </h1>
        </div>

        {/* Navegação */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Tarefas
          </Link>
          <button
            onClick={onLogout}
            className="ml-4 px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
