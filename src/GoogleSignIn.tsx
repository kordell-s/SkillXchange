import React from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const GoogleSignIn: React.FC = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // If new user, store in Firestore
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          profilePicture: user.photoURL
        });
      }

      alert("Signed in successfully!");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default GoogleSignIn;