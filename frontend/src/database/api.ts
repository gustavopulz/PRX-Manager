import { firestore } from './firestore';
import type { System, Message } from '../types';
// Salva mensagem na collection 'manager_messages'
export async function saveMessageToFirestore(message: Message) {
	await setDoc(doc(collection(firestore, 'manager_messages'), message.id), message);
}
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
export async function getMessagesFromFirestore(): Promise<Message[]> {
	const snapshot = await getDocs(collection(firestore, 'manager_messages'));
	return snapshot.docs.map(doc => doc.data() as Message);
}

export async function saveSystemToFirestore(system: System) {
	await setDoc(doc(collection(firestore, 'manager_systems'), system.id), system);
}

export async function getSystemsFromFirestore(): Promise<System[]> {
	const snapshot = await getDocs(collection(firestore, 'manager_systems'));
	return snapshot.docs.map(doc => doc.data() as System);
}