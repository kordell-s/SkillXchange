import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const Browse: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMatches(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMatches = async (userId: string) => {
    try {
      // Get the current user's skills_wanted
      const userRef = collection(db, "users");
      const userSnapshot = await getDocs(query(userRef, where("uid", "==", userId)));
      if (userSnapshot.empty) return;
      
      const currentUserData = userSnapshot.docs[0].data();
      const skillsWanted = currentUserData.skills_wanted || [];

      // Find users who offer those skills
      const usersRef = collection(db, "users");
      const matchedUsers: any[] = [];
      const allUsersSnapshot = await getDocs(usersRef);

      allUsersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.uid !== userId) {
          const matches = userData.skills_offered?.filter((skill: any) => 
            skillsWanted.some((wanted: any) => wanted.skill_name === skill.skill_name)
          );
          if (matches.length > 0) {
            matchedUsers.push({ ...userData, matches });
          }
        }
      });

      setUsers(matchedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setLoading(false);
    }
  };

  const handleRequestMatch = async (matchedUserId: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "matches"), {
        learner_id: user.uid,
        teacher_id: matchedUserId,
        status: "pending",
        timestamp: new Date()
      });
      alert("Match request sent!");
    } catch (error) {
      console.error("Error sending match request:", error);
    }
  };

  if (loading) return <p>Loading matches...</p>;

  return (
    <div>
      <h2>Browse Profiles</h2>
      {users.length === 0 ? (
        <p>No matches found</p>
      ) : (
        <ul>
          {users.map((matchedUser) => (
            <li key={matchedUser.uid}>
              <strong>{matchedUser.name}</strong> - {matchedUser.email}
              <p>Teaches: {matchedUser.matches.map((m: any) => m.skill_name).join(", ")}</p>
              <button onClick={() => handleRequestMatch(matchedUser.uid)}>Request Match</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Browse;
