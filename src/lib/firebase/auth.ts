import 'server-only';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { firebaseConfig } from './config';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { initAdmin } from './firebase-admin';

// Helper to get the Firebase app, initializing it if necessary
function getClientApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

// Sign in with email and password, and set session cookie
export async function signInWithEmail(email: string, password: string): Promise<void> {
  const app = getClientApp();
  const auth = getAuth(app);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  
  // Create session cookie
  const adminApp = await initAdmin();
  const adminAuth = getAdminAuth(adminApp);
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

  // Set cookie
  cookies().set('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
}

// Sign out and clear session cookie
export async function signOut(): Promise<void> {
    const app = getClientApp();
    const auth = getAuth(app);
    await firebaseSignOut(auth);
    cookies().delete('session');
}

// Get current user from session cookie
export async function getCurrentUser() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const adminApp = await initAdmin();
    const adminAuth = getAdminAuth(adminApp);
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    // Clear the invalid cookie
    cookies().delete('session');
    return null;
  }
}

// Check for admin privileges
export async function checkAdminPrivileges() {
    const user = await getCurrentUser();
    if (!user) {
        return false;
    }
    // Check if the user's email matches the admin email from env variables
    const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return isAdmin;
}
