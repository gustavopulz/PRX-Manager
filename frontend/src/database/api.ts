import { firestore } from './firestore';
import type { System } from '../types';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

export async function saveSystemToFirestore(system: System) {
	await setDoc(doc(collection(firestore, 'manager_systems'), system.id), system);
}

export async function getSystemsFromFirestore(): Promise<System[]> {
	const snapshot = await getDocs(collection(firestore, 'manager_systems'));
	return snapshot.docs.map(doc => doc.data() as System);
}