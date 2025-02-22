import React from "react";
import FirestoreTest from "./FirestoreTest"; // Import the Firestore test component
import "./App.css"; // Keep existing CSS import

const App: React.FC = () => {
  return (
    <div>
      <h1>🔥 SkillXchange MVP</h1>
      <FirestoreTest /> {/* Display Firestore test data */}
    </div>
  );
};

export default App;