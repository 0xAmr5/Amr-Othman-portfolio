import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEbKH0kkECUbtowi-y0pl8NUZ1-k-WVxA",
  authDomain: "amr-portfolio-64b55.firebaseapp.com",
  projectId: "amr-portfolio-64b55",
  storageBucket: "amr-portfolio-64b55.firebasestorage.app",
  messagingSenderId: "67453036769",
  appId: "1:67453036769:web:30eec94d68b537b00cefa0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);