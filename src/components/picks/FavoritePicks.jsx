import { useEffect, useState } from "react";
import { getTailsByUserId } from "../../services/tailsService";
import { getAllPicks } from "../../services/pickService";

export const FavoritePicks = ({ currentUser }) => {
  const [tails, setTails] = useState([]);
  const [picks, setPicks] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getAllPicks().then((picksArray) => {
      setPicks(picksArray);
    });
    getTailsByUserId(currentUser).then((userTails) => {
      setTails(userTails);
    });
  }, [currentUser]);

  useEffect(() => {
    if (picks.length && tails.length) {
      // Check if both arrays have data
      const filteredPicks = picks.filter((pick) =>
        tails.some((tail) => tail.pickId === pick.id)
      );
      setFavorites(filteredPicks);
    }
  }, [picks, tails]);

  return (
    <div className="picks-container">
      <h2 className="picks-title">My Favorite Picks</h2>
      <ul className="picks-grid">
        {favorites.map((pick) => (
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
                <h3 className="prediction-label">Badhabits' Prediction</h3>
                <h3 className="prediction-value">
                  {pick.predictedPercentage}%
                </h3>
              </div>

              <footer className="pick-footer">
                <span className="user-name">{pick.user.name}</span>
                <button
                  className="tail-button"
                  onClick={() => {
                    // Add untail functionality here
                  }}
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
