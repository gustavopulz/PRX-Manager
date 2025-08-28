import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Modal from './components/Modal';
import SystemForm from './components/SystemForm';
import SendMessageForm from './components/SendMessageForm';
import type { System, Message } from './types';
import Header from './components/Header';

export default function App() {
  const [systems, setSystems] = useState<System[]>([]);

  // Buscar sistemas do Firestore ao montar
  useEffect(() => {
    (async () => {
      try {
        const { initFirestore, getSystemsFromFirestore } = await import('./database/api');
        await initFirestore();
        const fetched = await getSystemsFromFirestore();
        setSystems(fetched);
      } catch (err) {
        console.error('Erro ao buscar sistemas do Firestore:', err);
      }
    })();
  }, []);
  const [messages, setMessages] = useState<Message[]>(() => {
    const msgs = localStorage.getItem('messages');
    return msgs ? JSON.parse(msgs) : [];
  });

  const [showSystemModal, setShowSystemModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  async function handleSaveSystem(system: System) {
    try {
      const { saveSystemToFirestore } = await import('./database/api');
      await saveSystemToFirestore(system);
      const updated = [...systems, system];
      setSystems(updated);
      setShowSystemModal(false);
    } catch (err) {
      alert('Erro ao salvar sistema no Firestore: ' + err);
    }
  }

  function handleSendMessage(msg: Message) {
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem('messages', JSON.stringify(updated));
    setShowMessageModal(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header separado */}
      <Header
        onOpenSystemModal={() => setShowSystemModal(true)}
        onOpenMessageModal={() => setShowMessageModal(true)}
      />

      {/* Conteúdo */}
      <main className="px-4 sm:px-6 lg:px-20 2xl:px-40 py-6">
        <Routes>
          <Route
            path="/"
            element={<Home systems={systems} messages={messages} />}
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* Modais */}
      <Modal
        isOpen={showSystemModal}
        onClose={() => setShowSystemModal(false)}
        title="Cadastrar Sistema"
      >
        <SystemForm onSave={handleSaveSystem} />
      </Modal>

      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="Enviar Mensagem"
      >
        <SendMessageForm systems={systems} onSend={handleSendMessage} />
      </Modal>
    </div>
  );
}
