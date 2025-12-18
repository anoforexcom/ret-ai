
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// SUBSTITUA COM A SUA CONFIGURAÇÃO DO FIREBASE CONSOLE
// (Vá a Project Settings > General > Your apps > SDK setup and configuration)
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

let db: any = null;
let auth: any = null;

// Verifica se o utilizador já configurou as chaves corretamente
const isConfigured = firebaseConfig.apiKey !== "SUA_API_KEY_AQUI" && 
                     firebaseConfig.apiKey.length > 0 &&
                     !firebaseConfig.apiKey.includes("SUA_API_KEY") &&
                     firebaseConfig.projectId !== "SEU_PROJETO_ID";

if (isConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase modular inicializado com sucesso.");
  } catch (e) {
    console.error("Erro ao inicializar Firebase. A usar modo offline:", e);
    db = null;
    auth = null;
  }
} else {
  console.warn("Firebase não configurado (chaves padrão detetadas). A funcionar em modo Demo Local.");
}

export { db, auth };
