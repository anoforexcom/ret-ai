
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

/**
 * CONFIGURAÇÃO DO FIREBASE
 * Substitua os valores abaixo pelos dados do seu projeto no Console do Firebase.
 */
const firebaseConfig = {
  apiKey: "COLE_AQUI_A_SUA_API_KEY", 
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:abcdef"
};

// Verifica se as chaves fornecidas são reais ou placeholders
const isConfigured = firebaseConfig.apiKey && 
                     firebaseConfig.apiKey !== "COLE_AQUI_A_SUA_API_KEY" &&
                     !firebaseConfig.apiKey.includes("seu-projeto");

let app;
let db: any = null;
let auth: any = null;
let storage: any = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log("✅ RetroColor Cloud: Firestore, Auth e Storage ligados.");
  } catch (e) {
    console.error("❌ Erro na ligação Cloud do Firebase:", e);
  }
} else {
  console.warn("⚠️ Modo Local: Configure o Firebase em firebaseConfig.ts para guardar fotos e dados.");
}

export { db, auth, storage, isConfigured };
