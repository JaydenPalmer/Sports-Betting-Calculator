import { useEffect, useState } from "react";
import { deletePick, getAllPicks } from "../../services/pickService";
import { useNavigate } from "react-router-dom";

export const MyPicks = ({ currentUser }) => {
  const [picks, setPicks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllPicks().then((allPicks) => {
      const filteredPicks = allPicks.filter(
        (pick) => pick.userId === currentUser
      );
      setPicks(filteredPicks);
    });
  }, [currentUser]);

  const handleEditBtn = (event) => {
    event.preventDefault();
    navigate(`/mypicks/${event.target.value}`);
  };

  const deletePickBtn = (event) => {
    deletePick(event.target.value).then(() => {
      getAllPicks().then((allPicks) => {
        const filteredPicks = allPicks.filter(
          (pick) => pick.userId === currentUser
        );
        setPicks(filteredPicks);
      });
    });
  };

  return (
    <div className="picks-container">
      <ul className="picks-grid">
        {picks.map((pick) => (
          <li key={pick.id} className="pick-card">
            <div className="image-container">
              <img
                src={pick.player.profilePic}
                alt={
                  pick?.player
                    ? `${pick.player?.name} headshot`
                    : "player headshot"
                }
                className="player-image"
              />
              <div className="player-name-overlay">
                <h3 className="player-name">{pick.player.name}</h3>
              </div>
            </div>

            <div className="pick-details">
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
                <div className="button-container">
                  <div className="button-container">
                    <button
                      className="edit-button"
                      value={pick.id}
                      onClick={handleEditBtn}
                    >
                      Edit Pick
                    </button>
                    <button
                      className="delete-button"
                      value={pick.id}
                      onClick={deletePickBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
