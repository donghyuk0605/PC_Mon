// lib/firebase.ts
import { initializeApp } from "firebase/app";
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

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
