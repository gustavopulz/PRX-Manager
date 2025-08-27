import { useState } from 'react';
import type { System } from '../types';

interface Props {
  onSave: (s: System) => void;
}

export default function SystemForm({ onSave }: Props) {
  const [name, setName] = useState('');
  const [webhookChangelog, setWebhookChangelog] = useState('');
  const [webhookMelhoria, setWebhookMelhoria] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const system: System = {
      id: crypto.randomUUID(),
      name,
      webhookChangelog,
      webhookMelhoria,
    };
    onSave(system);
    setName('');
    setWebhookChangelog('');
    setWebhookMelhoria('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nome do sistema"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
        required
      />
      <input
        type="url"
        placeholder="Webhook Changelog"
        value={webhookChangelog}
        onChange={(e) => setWebhookChangelog(e.target.value)}
        className="input"
        required
      />
      <input
        type="url"
        placeholder="Webhook Melhoria"
        value={webhookMelhoria}
        onChange={(e) => setWebhookMelhoria(e.target.value)}
        className="input"
        required
      />

      <button type="submit" className="button-blue">
        Salvar
      </button>
    </form>
  );
}
