
// Use namespaced compat imports to resolve missing modular export errors in Firebase v9+
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// SUBSTITUA COM A SUA CONFIGURAÇÃO DO FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDHiLNvs1alz2kST7eNOJHMA-9N1OezzKI",
  authDomain: "project-44f7e7f5-4bf3-4b-5b516.firebaseapp.com",
  projectId: "project-44f7e7f5-4bf3-4b-5b516",
  storageBucket: "project-44f7e7f5-4bf3-4b-5b516.firebasestorage.app",
  messagingSenderId: "28453566330",
  appId: "1:28453566330:web:792ed77487b239d27808c3"
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
    // Usando a sintaxe namespaced (v8 compat) para compatibilidade com o ambiente
    // Fix: Accessing apps, initializeApp, and app via compat layer
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
