
// Importações compatíveis com Firebase v9+ / v10
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

/**
 * CONFIGURAÇÃO DO FIREBASE
 * A chave de API abaixo foi atualizada com o valor fornecido: AIzaSyB8wmI7PLcaGowJ0r-ioJtT-avoUbkFkt4
 */
const firebaseConfig = {
  apiKey: "AIzaSyB8wmI7PLcaGowJ0r-ioJtT-avoUbkFkt4",
  authDomain: "project-44f7e7f5-4bf3-4b-5b516.firebaseapp.com",
  projectId: "project-44f7e7f5-4bf3-4b-5b516",
  storageBucket: "project-44f7e7f5-4bf3-4b-5b516.firebasestorage.ap",
  messagingSenderId: "28453566330",
  appId: "1:28453566330:web:792ed77487b239d27808c3"
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
