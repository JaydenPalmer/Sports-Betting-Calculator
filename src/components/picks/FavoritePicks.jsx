import { useEffect, useState } from "react";
import { deleteTail, getTailsByUserId } from "../../services/tailsService";
import { getAllPicks } from "../../services/pickService";
import { Link } from "react-router-dom";

export const FavoritePicks = ({ currentUser }) => {
  const [tails, setTails] = useState([]);
  const [picks, setPicks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentUserTails, setCurrentUserTails] = useState([]);

  useEffect(() => {
    getAllPicks().then((picksArray) => {
      setPicks(picksArray);
    });
    getTailsByUserId(currentUser).then((userTails) => {
      setTails(userTails);
      setCurrentUserTails(userTails);
    });
  }, [currentUser]);

  useEffect(() => {
    const filteredPicks = picks.filter((pick) =>
      tails.some((tail) => tail.pickId === pick.id)
    );
    setFavorites(filteredPicks);
  }, [picks, tails, currentUserTails]);

  const handleTailBtn = async (event, pickId) => {
    event.preventDefault();
    const tailToDelete = currentUserTails.find(
      (tail) => tail.pickId === pickId
    );
    if (tailToDelete) {
      await deleteTail(tailToDelete.id);
      const updatedUserTails = await getTailsByUserId(currentUser);
      setCurrentUserTails(updatedUserTails);
      setTails(updatedUserTails);
    }
  };

  return (
    <div className="picks-container">
      <ul className="picks-grid">
        {favorites?.map((pick) => (
          <li key={pick.id} className="pick-card">
            <div className="image-container">
              <img
                src={pick.player.profilePic}
                alt={`${pick.player.name} headshot`}
                className="player-image"
              />
              <div className="player-name-overlay">
                <h3 className="player-name">{pick.player.name}</h3>
              </div>
            </div>

            <div className="pick-details">
              <div className="stat-name">{pick.stat.name}</div>
              <h2
                className={pick.isOver ? "over-indicator" : "under-indicator"}
              >
                {pick.isOver ? "Over" : "Under"} {pick.predictedValue}{" "}
                {pick.stat.name}
              </h2>

              <div className="prediction-section">
                <h3 className="prediction-label">Badhabits' Pick Prediction</h3>
                <h3 className="prediction-value">
                  {pick.predictedPercentage}%
                </h3>
              </div>

              <footer className="pick-footer">
                <Link to={`/userprofile/${pick.userId}`}>
                  <span className="user-name">{pick.user.name}</span>
                </Link>
                <button
                  className="tail-button"
                  onClick={(event) => handleTailBtn(event, pick.id)}
                >
                  TRASH
                </button>
              </footer>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
