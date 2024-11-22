import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAllPicks } from "../../services/pickService";
import { getAllParlays } from "../../services/parlayService";
import { updateParlay } from "../../services/parlayService";
import "./EditParlay.css";

export const EditParlay = ({ currentUser }) => {
  const { parlayId } = useParams();
  const [parlays, setParlays] = useState([]);
  const [parlayDetails, setParlayDetails] = useState([]);
  const [isUpdatingPercentage, setIsUpdatingPercentage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAllPicks(), getAllParlays()]).then(
      ([allPicks, allParlays]) => {
        const userParlay = allParlays.find(
          (p) =>
            p.id === parseInt(parlayId) && p.userId === parseInt(currentUser)
        );

        if (userParlay) {
          setParlays([userParlay]);
          const parlayPicks = allPicks.filter((pick) =>
            userParlay.pickIds.includes(pick.id)
          );
          setParlayDetails(parlayPicks);
        }
      }
    );
  }, [parlayId, currentUser]);

  useEffect(() => {
    if (
      parlayDetails.length > 0 &&
      parlays.length > 0 &&
      !isUpdatingPercentage
    ) {
      setIsUpdatingPercentage(true);

      // Calculate new percentage based on all picks
      const totalPercentage = parlayDetails.reduce((acc, pick) => {
        return acc + pick.predictedPercentage;
      }, 0);

      const averagePercentage = Math.round(
        totalPercentage / parlayDetails.length
      );

      // Create updated parlay object
      const updatedParlay = {
        ...parlays[0],
        predictedPercentage: averagePercentage,
      };

      // Update parlay in database
      updateParlay(parlayId, updatedParlay)
        .then(() => {
          setParlays([updatedParlay]);
        })
        .finally(() => {
          setIsUpdatingPercentage(false);
        });
    }
  }, [parlayDetails]);

  const handleDoneUpdating = (event) => {
    event.preventDefault();
    navigate("/mypicks");
  };

  return (
    <div className="edit-parlay-container">
      {parlays.map((parlay) => {
        const parlayPicks = parlayDetails.filter((pick) =>
          parlay.pickIds.includes(pick.id)
        );

        return (
          <ul key={parlay.id}>
            <li className="parlay-main-card">
              <div className="parlay-picks-list">
                {parlayPicks.map((pick) => (
                  <Link
                    key={pick.id}
                    to={`/mypicks/${pick.id}`}
                    className="parlay-single-pick-link"
                  >
                    <div className="parlay-single-pick">
                      <div className="parlay-player-image-container">
                        <img
                          src={pick.player.profilePic}
                          alt={`${pick.player?.name} headshot`}
                          className="parlay-player-image"
                        />
                      </div>
                      <div className="parlay-pick-info-container">
                        <h3 className="parlay-player-name">
                          {pick.player.name}
                        </h3>
                        <div className="parlay-pick-details">
                          <h2
                            className={
                              pick.isOver
                                ? "parlay-over-text"
                                : "parlay-under-text"
                            }
                          >
                            {pick.isOver ? "Over" : "Under"}{" "}
                            {pick.predictedValue} {pick.stat.name}
                          </h2>
                          <div className="parlay-prediction-container">
                            <h3 className="parlay-prediction-number">
                              {pick.predictedPercentage}%
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="prediction-section">
                <h3 className="prediction-label">
                  Bad Habits' Parlay Prediction:
                </h3>
                <h3 className="parlay-total-percentage">
                  {parlay.predictedPercentage}%
                </h3>
              </div>
              <div className="done-updating-container">
                <button
                  className="done-updating-btn"
                  onClick={handleDoneUpdating}
                >
                  DONE UPDATING
                </button>
              </div>
            </li>
          </ul>
        );
      })}
    </div>
  );
};
