import { useEffect, useState } from "react";
import { deletePick, getAllPicks } from "../../services/pickService";
import { useNavigate } from "react-router-dom";
import { ParlayDisplay } from "../parlays/ParlayDisplay";
import { deleteParlay, getAllParlays } from "../../services/parlayService";

export const MyPicks = ({ currentUser }) => {
  const [picks, setPicks] = useState([]);
  const [parlays, setParlays] = useState([]);
  const [parlayDetails, setParlayDetails] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAllPicks(), getAllParlays()]).then(
      ([allPicks, allParlays]) => {
        const userPicks = allPicks.filter(
          (pick) => pick.userId === parseInt(currentUser)
        );
        const userParlays = allParlays.filter(
          (parlay) => parlay.userId === parseInt(currentUser)
        );

        const parlayPickIds = userParlays.flatMap((parlay) => parlay.pickIds);
        const parlayPicks = userPicks.filter((pick) =>
          parlayPickIds.includes(pick.id)
        );
        const singlePicks = userPicks.filter(
          (pick) => !parlayPickIds.includes(pick.id)
        );

        setPicks(singlePicks);
        setParlayDetails(parlayPicks);
        setParlays(userParlays);
      }
    );
  }, [currentUser]);

  const refreshData = () => {
    Promise.all([getAllPicks(), getAllParlays()]).then(
      ([allPicks, allParlays]) => {
        const userPicks = allPicks.filter(
          (pick) => pick.userId === parseInt(currentUser)
        );
        const userParlays = allParlays.filter(
          (parlay) => parlay.userId === parseInt(currentUser)
        );

        const parlayPickIds = userParlays.flatMap((parlay) => parlay.pickIds);
        const parlayPicks = userPicks.filter((pick) =>
          parlayPickIds.includes(pick.id)
        );
        const singlePicks = userPicks.filter(
          (pick) => !parlayPickIds.includes(pick.id)
        );

        setPicks(singlePicks);
        setParlayDetails(parlayPicks);
        setParlays(userParlays);
      }
    );
  };

  const handleEditBtn = (event) => {
    event.preventDefault();
    navigate(`/mypicks/${event.target.value}`);
  };

  const handleEditParlayBtn = (event) => {
    event.preventDefault();
    navigate(`/mypicks/parlay/${event.target.value}`);
  };

  const deletePickBtn = (event) => {
    const pickId = parseInt(event.target.value);
    deletePick(pickId).then(refreshData);
  };

  const deleteParlayBtn = (event) => {
    const parlayId = parseInt(event.target.value);
    const parlay = parlays.find((p) => p.id === parlayId);
    deleteParlay(parlay.id, parlay.pickIds).then(refreshData);
  };

  return (
    <div className="picks-container">
      <ul className="picks-grid">
        {
          <ParlayDisplay
            parlays={parlays}
            parlayDetails={parlayDetails}
            handleEditParlayBtn={handleEditParlayBtn}
            deleteParlayBtn={deleteParlayBtn}
            currentUser={currentUser}
          />
        }
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
                <h3 className="prediction-label">Badhabits' Pick Prediction</h3>
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
