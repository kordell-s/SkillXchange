import React from "react";
import FirestoreTest from "./FirestoreTest";
import GoogleSignIn from "./GoogleSignIn";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>🔥 SkillXchange MVP</h1>
        <nav>
          <Link to="/login">Sign In</Link>
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