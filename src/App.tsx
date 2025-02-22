import React, { useEffect, useState } from "react";
import FirestoreTest from "./FirestoreTest";
import GoogleSignIn from "./GoogleSignIn";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 🔥 Set user if logged in, otherwise null
    });

    return () => unsubscribe(); // Cleanup function to prevent memory leaks
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out!");
  };

  return (
    <Router>
      <div>
        <h1>🔥 SkillXchange MVP</h1>
        <nav>
          {user ? (
            <>
              <p>Welcome, {user.displayName}!</p>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Sign In</Link>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<FirestoreTest />} />
          <Route path="/login" element={<GoogleSignIn />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
