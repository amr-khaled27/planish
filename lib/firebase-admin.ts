import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const requiredEnvVars = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    const error = `Hey! You're missing: FIREBASE_${key.toUpperCase()}`;
    throw new Error(error);
  }
}

const firebaseAdminConfig = {
  credential: cert({
    projectId: requiredEnvVars.projectId!,
    clientEmail: requiredEnvVars.clientEmail!,
    privateKey: requiredEnvVars.privateKey!.replace(/\\n/g, "\n"),
  }),
};

const adminApp =
  getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

export const adminAuth = getAuth(adminApp);
