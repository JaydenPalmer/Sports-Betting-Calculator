import { Link } from "react-router-dom";
import "./ParlayDisplay.css";

export const ParlayDisplay = ({
  parlays,
  parlayDetails,
  handleTailBtn,
  handleEditParlayBtn,
  deleteParlayBtn,
  currentUser,
  currentUserTails,
}) => {
  return (
    <>
      {parlays.map((parlay) => {
        // Get all picks for this parlay
        const parlayPicks = parlayDetails.filter((pick) =>
          parlay.pickIds.includes(pick.id)
        );

        return (
          <li key={parlay.id} className="parlay-main-card">
            <div className="parlay-picks-list">
              {parlayPicks.map((pick) => (
                <div key={pick.id} className="parlay-single-pick">
                  <div className="parlay-player-image-container">
                    <img
                      src={pick.player.profilePic}
                      alt={`${pick.player?.name} headshot`}
                      className="parlay-player-image"
                    />
                  </div>
                  <div className="parlay-pick-info-container">
                    <h3 className="parlay-player-name">{pick.player.name}</h3>
                    <div className="parlay-pick-details">
                      <h2
                        className={
                          pick.isOver ? "parlay-over-text" : "parlay-under-text"
                        }
                      >
                        {pick.isOver ? "Over" : "Under"} {pick.predictedValue}{" "}
                        {pick.stat.name}
                      </h2>
                      <div className="parlay-prediction-container">
                        <h3 className="parlay-prediction-number">
                          {pick.predictedPercentage}%
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
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
            <footer className="parlay-footer">
              <Link to={`/userprofile/${parlay.userId}`}>
                <span className="parlay-username">
                  {parlayPicks[0]?.user.name}
                </span>
              </Link>
              <div className="parlay-button-container">
                {parseInt(currentUser) !== parlay.userId ? (
                  <button
                    className="parlay-tail-button"
                    onClick={(event) => handleTailBtn(event, parlay.id)}
                  >
                    {currentUserTails?.find((tail) => tail.pickId === parlay.id)
                      ? "Trash"
                      : "Tail"}
                  </button>
                ) : (
                  <>
                    <button
                      className="parlay-edit-button"
                      value={parlay.id}
                      onClick={handleEditParlayBtn}
                    >
                      Edit
                    </button>
                    <button
                      className="parlay-delete-button"
                      value={parlay.id}
                      onClick={deleteParlayBtn}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </footer>
          </li>
        );
      })}
    </>
  );
};
