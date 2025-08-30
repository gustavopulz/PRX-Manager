import { firestore } from './firestore';
import type { System, Message } from '../types';
// Salva mensagem na collection 'manager_messages'
export async function saveMessageToFirestore(message: Message) {
  await setDoc(
    doc(collection(firestore, 'manager_messages'), message.id),
    message
  );
}
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
export async function getMessagesFromFirestore(): Promise<Message[]> {
  const snapshot = await getDocs(collection(firestore, 'manager_messages'));
  return snapshot.docs.map((doc) => doc.data() as Message);
}

export async function saveSystemToFirestore(system: System) {
  await setDoc(
    doc(collection(firestore, 'manager_systems'), system.id),
    system
  );
}

export async function getSystemsFromFirestore(): Promise<System[]> {
  const snapshot = await getDocs(collection(firestore, 'manager_systems'));
  return snapshot.docs.map((doc) => doc.data() as System);
}

// --- TASK SYSTEM ---
import type { Task, Categoria, Envolvido, Checklist, Flag } from '../types';
import { getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Tasks
export async function saveTaskToFirestore(task: Task) {
  await setDoc(doc(collection(firestore, 'manager_tasks'), task.id), task);
}

export async function getTasksFromFirestore(): Promise<Task[]> {
  const snapshot = await getDocs(collection(firestore, 'manager_tasks'));
  return snapshot.docs.map((doc) => doc.data() as Task);
}

export async function getTaskById(id: string): Promise<Task | null> {
  const ref = doc(firestore, 'manager_tasks', id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Task) : null;
}

export async function updateTaskInFirestore(id: string, data: Partial<Task>) {
  const ref = doc(firestore, 'manager_tasks', id);
  await updateDoc(ref, data);
}

export async function deleteTaskFromFirestore(id: string) {
  const ref = doc(firestore, 'manager_tasks', id);
  await deleteDoc(ref);
}

// Categorias
export async function saveCategoriaToFirestore(categoria: Categoria) {
  await setDoc(
    doc(collection(firestore, 'manager_categorias'), categoria.id),
    categoria
  );
}

export async function getCategoriasFromFirestore(): Promise<Categoria[]> {
  const snapshot = await getDocs(collection(firestore, 'manager_categorias'));
  return snapshot.docs.map((doc) => doc.data() as Categoria);
}

// Envolvidos
export async function saveEnvolvidoToFirestore(envolvido: Envolvido) {
  await setDoc(
    doc(collection(firestore, 'manager_envolvidos'), envolvido.id),
    envolvido
  );
}

export async function getEnvolvidosFromFirestore(): Promise<Envolvido[]> {
  const snapshot = await getDocs(collection(firestore, 'manager_envolvidos'));
  return snapshot.docs.map((doc) => doc.data() as Envolvido);
}

// Checklists (opcional, pode ser embutido na Task)
export async function saveChecklistToFirestore(checklist: Checklist) {
  await setDoc(
    doc(collection(firestore, 'manager_checklists'), checklist.id),
    checklist
  );
}

export async function getChecklistsFromFirestore(): Promise<Checklist[]> {
  const snapshot = await getDocs(collection(firestore, 'manager_checklists'));
  return snapshot.docs.map((doc) => doc.data() as Checklist);
}

// Flags
export async function saveFlagToFirestore(flag: Flag) {
  await setDoc(doc(collection(firestore, 'manager_flags'), flag.id), flag);
}

export async function getFlagsFromFirestore(): Promise<Flag[]> {
  const snapshot = await getDocs(collection(firestore, 'manager_flags'));
  return snapshot.docs.map((doc) => doc.data() as Flag);
}
