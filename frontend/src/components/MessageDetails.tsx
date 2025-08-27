import type { Message } from '../types';

interface Props {
  message: Message;
}

export default function MessageDetails({ message }: Props) {
  return (
    <div className="space-y-2">
      <p>
        <b>Sistema:</b> {message.systemName}
      </p>
      <p>
        <b>Canal:</b> {message.channel}
      </p>
      <p>
        <b>Título:</b> {message.title}
      </p>
      <p>
        <b>Embed:</b> {message.embed ? 'Sim' : 'Não'}
      </p>
      <p>
        <b>Mensagem:</b>
      </p>
      <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
        {message.content}
      </pre>
    </div>
  );
}
