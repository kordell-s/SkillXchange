import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, DocumentData } from "firebase/firestore";

// Define TypeScript interfaces for users and skills
interface User {
  id: string;
  name: string;
  email: string;
}

interface Skill {
  id: string;
  skill_name: string;
  category: string;
}

const FirestoreTest: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList: User[] = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(usersList);

        // Fetch skills
        const skillsSnapshot = await getDocs(collection(db, "skills"));
        const skillsList: Skill[] = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
        setSkills(skillsList);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>🔥 Firestore Data Test</h1>

      <h2>👤 Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>

      <h2>🎓 Skills</h2>
      <ul>
        {skills.map(skill => (
          <li key={skill.id}>{skill.skill_name} - {skill.category}</li>
        ))}
      </ul>
    </div>
  );
};

export default FirestoreTest;
