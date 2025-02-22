import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bio, setBio] = useState("");
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setBio(userData.bio || "");
          setSkillsOffered(userData.skills_offered || []);
          setSkillsWanted(userData.skills_wanted || []);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        bio,
        skills_offered: skillsOffered,
        skills_wanted: skillsWanted
      });
      alert("Profile updated!");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Name:</strong> {user?.displayName}</p>

      <label>Bio:</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

      <label>Skills I Can Teach:</label>
      <input
        type="text"
        placeholder="Comma-separated skills"
        value={skillsOffered.join(", ")}
        onChange={(e) => setSkillsOffered(e.target.value.split(", "))}
      />

      <label>Skills I Want to Learn:</label>
      <input
        type="text"
        placeholder="Comma-separated skills"
        value={skillsWanted.join(", ")}
        onChange={(e) => setSkillsWanted(e.target.value.split(", "))}
      />

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default Profile;
