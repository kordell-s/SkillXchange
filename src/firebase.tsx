import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Define Firebase config type
const firebaseConfig = {
  apiKey: "AIzaSyCszzMDpfeD9viCyZVg64Uil-AQXnJaNWM",
  authDomain: "skill-exchange-425c5.firebaseapp.com",
  projectId: "skill-exchange-425c5",
  storageBucket: "skill-exchange-425c5.firebasestorage.app",
  messagingSenderId: "955612438992",
  appId: "1:955612438992:web:20f98b15ddea618fd319d5",
  measurementId: "G-HS7SSXKWBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth, db };
