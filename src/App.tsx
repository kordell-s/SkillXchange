import React, { useEffect, useState } from "react";
import FirestoreTest from "./FirestoreTest";
import GoogleSignIn from "./GoogleSignIn";
import Profile from "./Profile";
import Browse from "./Browse";
import Matches from "./Matches";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
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
              <Link to="/profile">Profile</Link> | 
              <Link to="/browse">Browse Profiles</Link> | 
              <Link to="/matches">My Matches</Link> | 
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Sign In</Link>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<FirestoreTest />} />
          <Route path="/login" element={<GoogleSignIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/matches" element={<Matches />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
