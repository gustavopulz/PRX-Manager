import { firestore, initFirestore } from './firestore';
import type { System } from '../types';

export { initFirestore };

export async function saveSystemToFirestore(system: System) {
	if (!firestore) {
		throw new Error('Firestore não inicializado. Chame initFirestore primeiro.');
	}
	await firestore.collection('manager_systems').doc(system.id).set(system);
}

export async function getSystemsFromFirestore(): Promise<System[]> {
	if (!firestore) {
		throw new Error('Firestore não inicializado. Chame initFirestore primeiro.');
	}
	const snapshot = await firestore.collection('manager_systems').get();
	return snapshot.docs.map(doc => doc.data() as System);
}