import admin from 'firebase-admin';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export async function initAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
