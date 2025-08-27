import { useState } from 'react';
import type { Message, System } from '../types';
import MessageList from '../components/MessageList';
import Modal from '../components/Modal';
import MessageDetails from '../components/MessageDetails';

interface Props {
  systems: System[];
  messages: Message[];
}

export default function Home({ messages }: Props) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manager de Sistemas</h2>

      <MessageList messages={messages} onView={(m) => setSelectedMessage(m)} />

      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Detalhes da Mensagem"
      >
        {selectedMessage && <MessageDetails message={selectedMessage} />}
      </Modal>
    </div>
  );
}
