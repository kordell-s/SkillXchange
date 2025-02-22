import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const Matches: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMatchRequests(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMatchRequests = async (userId: string) => {
    try {
      const matchRequestsRef = collection(db, "matches");
      const q = query(matchRequestsRef, where("teacher_id", "==", userId), where("status", "==", "pending"));
      const matchRequestsSnapshot = await getDocs(q);

      const matchRequests: any[] = [];
      for (const matchDoc of matchRequestsSnapshot.docs) {
        const matchData = matchDoc.data();

        // Fetch the learner's profile to get their name
        const learnerRef = doc(db, "users", matchData.learner_id);
        const learnerSnap = await getDoc(learnerRef);
        const learnerName = learnerSnap.exists() ? learnerSnap.data().name : "Unknown User";

        matchRequests.push({ id: matchDoc.id, learnerName, ...matchData });
      }

      setMatches(matchRequests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching match requests:", error);
      setLoading(false);
    }
  };

  const handleResponse = async (matchId: string, status: "accepted" | "rejected") => {
    try {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, { status });

      setMatches(matches.filter((match) => match.id !== matchId)); // Remove from UI
      alert(`Match ${status}!`);
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  if (loading) return <p>Loading match requests...</p>;

  return (
    <div>
      <h2>My Matches</h2>
      {matches.length === 0 ? (
        <p>No pending match requests</p>
      ) : (
        <ul>
          {matches.map((match) => (
            <li key={match.id}>
              <p><strong>Request from:</strong> {match.learnerName}</p>
              <button onClick={() => handleResponse(match.id, "accepted")}>Accept</button>
              <button onClick={() => handleResponse(match.id, "rejected")}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Matches;
