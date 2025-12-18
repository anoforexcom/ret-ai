
// Use namespaced imports to resolve missing modular export errors
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// SUBSTITUA COM A SUA CONFIGURAÇÃO DO FIREBASE CONSOLE
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
    // Usando a sintaxe namespaced (v8) para compatibilidade com o ambiente
    const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
    db = app.firestore();
    auth = app.auth();
    console.log("Firebase inicializado com sucesso (Sintaxe Namespaced).");
  } catch (e) {
    console.error("Erro ao inicializar Firebase. A usar modo offline:", e);
    db = null;
    auth = null;
  }
} else {
  console.warn("Firebase não configurado (chaves padrão detetadas). A funcionar em modo Demo Local.");
}

export { db, auth };
