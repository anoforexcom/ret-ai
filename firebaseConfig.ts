
// Importações compatíveis com Firebase v9+ / v10
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

/**
 * CONFIGURAÇÃO DO FIREBASE
 * A chave de API abaixo foi atualizada com o valor fornecido: AIzaSyB8wmI7PLcaGowJ0r-ioJtT-avoUbkFkt4
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db: any = null;
let auth: any = null;

// Verifica se as chaves foram preenchidas
const isConfigured = firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "" &&
  firebaseConfig.projectId !== "";

if (isConfigured) {
  try {
    const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
    db = app.firestore();
    auth = app.auth();
    console.log("✅ RetroColor Engine: Ligado aos serviços de dados com a nova chave.");
  } catch (e) {
    console.error("❌ Erro ao ligar ao Firebase:", e);
    db = null;
    auth = null;
  }
}

export { db, auth };
