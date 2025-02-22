// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
