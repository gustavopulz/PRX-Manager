// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4J7klu-GKEOu3Agxp8k_TJPCQlNibmik",
  authDomain: "finance-system-ab66d.firebaseapp.com",
  projectId: "finance-system-ab66d",
  storageBucket: "finance-system-ab66d.firebasestorage.app",
  messagingSenderId: "953700976889",
  appId: "1:953700976889:web:0feb2eb9a84586da30ba28",
  measurementId: "G-5VPMZ305WM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };