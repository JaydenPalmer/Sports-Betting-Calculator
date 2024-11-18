import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../services/userService";
import { getPicksByUserId } from "../../services/pickService";
import { getAllTails } from "../../services/tailsService";
import "./UserProfile.css";

export const UserProfile = () => {
  const [user, setUser] = useState([]);
  const [userPicks, setUserPicks] = useState([]);
  const [tails, setTails] = useState([]);
  const [tailPoints, setTailPoints] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    getUserById(userId).then((userData) => {
      setUser(userData);
    });
    getPicksByUserId(userId).then((picks) => {
      setUserPicks(picks);
    });
    getAllTails().then((allTails) => {
      setTails(allTails);
    });
  }, [userId]);

  useEffect(() => {
    const tailedPicks = userPicks.filter((pick) =>
      tails.some((tail) => tail.pickId === pick.id)
    );

    setTailPoints((prev) => [...prev, ...tailedPicks]);
  }, [userPicks, tails]);

  return (
    <section className="profile-container">
      <div className="profile-header">
        <h2 className="profile-name">{user.name}</h2>
        <h3 className="profile-email">{user.email}</h3>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <h2 className="stat-number">{userPicks.length}</h2>
          <p className="stat-label">picks posted</p>
        </div>
        <div className="stat-item">
          <h2 className="stat-number">{tailPoints.length}</h2>
          <p className="stat-label">Tail Points</p>
        </div>
      </div>
    </section>
  );
};
