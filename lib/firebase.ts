// lib/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmeGdw7tegLS9l0LBMc6mCoi_3cFTs-zE",
  authDomain: "pc-mon-55f6a.firebaseapp.com",
  projectId: "pc-mon-55f6a",
  storageBucket: "pc-mon-55f6a.firebasestorage.app",
  messagingSenderId: "592245570252",
  appId: "1:592245570252:web:e888e0290fe89990a6a069",
  measurementId: "G-KYCQB7LXLH",
};

// ✅ 이미 초기화된 앱이 있으면 재사용하고, 없으면 초기화
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
