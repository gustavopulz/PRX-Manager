import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import LoginPage from './pages/LoginPage';
import Modal from './components/Modal';
import SystemForm from './components/SystemForm';
import SendMessageForm from './components/SendMessageForm';
import type { System, Message } from './types';
import Header from './components/Header';
import { onUserChanged, logout } from './database/auth';

export default function App() {
  const [systems, setSystems] = useState<System[]>([]);
  const [messages, setMessages] = useState<Message[]>(() => {
    const msgs = localStorage.getItem('messages');
    return msgs ? JSON.parse(msgs) : [];
  });
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onUserChanged(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const { getSystemsFromFirestore } = await import('./database/api');
          const fetched = await getSystemsFromFirestore();
          setSystems(fetched);
        } catch (err) {
          console.error('Erro ao buscar sistemas do Firestore:', err);
        }
      })();
    }
  }, [user]);

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

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header
        onOpenSystemModal={() => setShowSystemModal(true)}
        onOpenMessageModal={() => setShowMessageModal(true)}
      />
      <button className="absolute top-4 right-4 button-blue" onClick={logout}>Sair</button>
      <main className="px-4 sm:px-6 lg:px-20 2xl:px-40 py-6">
        <Routes>
          <Route path="/" element={<Home systems={systems} messages={messages} />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
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
