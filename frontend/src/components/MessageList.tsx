import type { Message } from '../types';

interface Props {
  messages: Message[];
  onView: (m: Message) => void;
}

export default function MessageList({ messages, onView }: Props) {
  if (messages.length === 0)
    return <p className="text-gray-500">Nenhuma mensagem enviada ainda.</p>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Mensagens Enviadas</h3>
      <ul className="space-y-2">
        {messages.map((m) => (
          <li key={m.id} className="border rounded p-3 flex justify-between">
            <div>
              <p className="font-semibold">{m.title}</p>
              <p className="text-sm text-gray-600">
                {m.systemName} • {m.channel} •{' '}
                {new Date(m.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => onView(m)}
              className="text-blue-600 hover:underline"
            >
              Ver
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
