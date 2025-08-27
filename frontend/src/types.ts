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
