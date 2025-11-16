'use client';
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);

// La liste des e-mails administrateurs est lue à partir des variables d'environnement.
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',');

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim());
}

export function getCurrentUser() {
  return auth.currentUser;
}
