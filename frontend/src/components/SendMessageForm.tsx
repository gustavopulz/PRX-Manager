import { useState } from 'react';
import type { Message, System } from '../types';
import { saveMessageToFirestore } from '../database/api';

interface Props {
  systems: System[];
  onSend: (m: Message) => void;
}

export default function SendMessageForm({ systems, onSend }: Props) {
  const [systemId, setSystemId] = useState('');
  const [channel, setChannel] = useState<'changelog' | 'melhoria'>('changelog');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [embed, setEmbed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sys = systems.find((s) => s.id === systemId);
    if (!sys) return;

    const webhookUrl =
      channel === 'changelog' ? sys.webhookChangelog : sys.webhookMelhoria;

    // Criar objeto de mensagem para Firestore
    const msg: Message = {
      id: crypto.randomUUID(),
      systemId: sys.id,
      systemName: sys.name,
      channel,
      title,
      content,
      embed,
      createdAt: new Date().toISOString(),
    };

    // 🔥 Enviar pro Discord
    try {
      const body = embed
        ? {
            embeds: [
              {
                title,
                description: content,
                color: 5814783, // azulzinho
              },
            ],
          }
        : {
            content: `**${title}**\n${content}`,
          };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error('Erro ao enviar para Discord:', await res.text());
      }
    } catch (err) {
      console.error('Falha ao enviar mensagem:', err);
    }

    // Salvar mensagem no Firestore
    await saveMessageToFirestore(msg);
    onSend(msg);

    // resetar form
    setSystemId('');
    setTitle('');
    setContent('');
    setEmbed(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={systemId}
        onChange={(e) => setSystemId(e.target.value)}
        className="select"
        required
      >
        <option value="">Selecione o sistema</option>
        {systems.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={channel}
        onChange={(e) => setChannel(e.target.value as 'changelog' | 'melhoria')}
        className="select"
      >
        <option value="changelog">Changelog</option>
        <option value="melhoria">Melhoria</option>
      </select>

      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
        required
      />

      <textarea
        placeholder="Mensagem (Markdown/Discord suportado)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea h-28"
        required
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={embed}
          onChange={(e) => setEmbed(e.target.checked)}
          className="checkbox"
        />
        Enviar como embed
      </label>

      <button type="submit" className="button-green">
        Enviar
      </button>
    </form>
  );
}
