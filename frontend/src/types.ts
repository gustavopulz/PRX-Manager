export interface Flag {
  id: string;
  nome: string;
  cor: string;
  webhook: string;
}
export interface System {
  id: string;
  name: string;
  webhookChangelog: string;
  webhookMelhoria: string;
}

export interface Message {
  id: string;
  systemId: string;
  systemName: string;
  channel: 'changelog' | 'melhoria';
  title: string;
  content: string;
  embed: boolean;
  createdAt: string;
}

export type TaskStatus = 'Triagem' | 'Em Andamento' | 'Testes' | 'Concluído';

export interface Categoria {
  id: string;
  nome: string;
  cor: string; // hex ou nome
  webhook?: string;
  flags?: Flag[];
}

export interface Envolvido {
  id: string;
  nome: string;
}

export interface ChecklistItem {
  id: string;
  descricao: string;
  feito: boolean;
}

export interface Checklist {
  id: string;
  titulo: string;
  itens: ChecklistItem[];
}

export interface Task {
  id: string;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  categoria: Categoria;
  envolvidos: Envolvido[];
  checklists: Checklist[];
  criadoEm: string;
  atualizadoEm: string;
  arquivada?: boolean;
  flagId?: string;
}
