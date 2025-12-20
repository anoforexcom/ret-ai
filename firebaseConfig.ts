
// Importações compatíveis com Firebase v9+ / v10
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

/**
 * CONFIGURAÇÃO DO FIREBASE
 * 1. Vá ao Console do Firebase > Configurações do Projeto
 * 2. Copie o objeto 'firebaseConfig' e substitua os valores abaixo:
 */
const firebaseConfig = {
  apiKey: "AIzaSyDHiLNvs1alz2kST7eNOJHMA-9N1OezzKI",
  authDomain: "project-44f7e7f5-4bf3-4b-5b516.firebaseapp.com",
  projectId: "project-44f7e7f5-4bf3-4b-5b516",
  storageBucket: "project-44f7e7f5-4bf3-4b-5b516.firebasestorage.ap",
  messagingSenderId: "28453566330",
  appId: "1:28453566330:web:792ed77487b239d27808c3"
};

let db: any = null;
let auth: any = null;

// Verifica se as chaves foram preenchidas (evita erro se estiverem vazias)
const isConfigured = firebaseConfig.apiKey && 
                     firebaseConfig.apiKey !== "AIzaSyDHiLNvs1alz2kST7eNOJHMA-9N1OezzKI" &&
                     firebaseConfig.projectId !== "project-44f7e7f5-4bf3-4b-5b516";

if (isConfigured) {
  try {
    const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
    db = app.firestore();
    auth = app.auth();
    console.log("✅ RetroColor Engine: Ligado ao Firebase com sucesso.");
  } catch (e) {
    console.error("❌ Erro ao ligar ao Firebase. O site funcionará apenas em modo local (demo):", e);
    db = null;
    auth = null;
  }
} else {
  console.warn("⚠️ Firebase não configurado. As contas de clientes e saldo serão perdidos ao atualizar a página.");
}

export { db, auth };
