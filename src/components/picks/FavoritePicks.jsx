import { useEffect, useState } from "react";
import { getAllPicks } from "../../services/pickService";
import {
  deleteParlayTail,
  deleteTail,
  getAllTails,
  getTailsByUserId,
  postParlayTail,
  postTail,
} from "../../services/tailsService";
import {
  getAllParlays,
  getUserParlayTails,
} from "../../services/parlayService";
import { Link } from "react-router-dom";
import { ParlayDisplay } from "../parlays/ParlayDisplay";

export const FavoritePicks = ({ currentUser }) => {
  const [favorites, setFavorites] = useState([]); // regular tailed picks
  const [parlays, setParlays] = useState([]); // all parlays
  const [parlayDetails, setParlayDetails] = useState([]); // picks that make up the parlays
  const [allTails, setAllTails] = useState([]);
  const [currentUserTails, setCurrentUserTails] = useState([]);
  const [parlayTails, setParlayTails] = useState([]);

  // Initial load
  useEffect(() => {
    Promise.all([
      getAllPicks(),
      getAllParlays(),
      getAllTails(),
      getUserParlayTails(currentUser),
    ]).then(([allPicks, allParlays, tails, userParlayTails]) => {
      // Get user's tailed picks
      const userTails = tails.filter(
        (tail) => tail.userId === parseInt(currentUser)
      );

      // Get individually tailed picks
      const tailedPicks = allPicks.filter((pick) =>
        userTails.some((tail) => tail.pickId === pick.id)
      );

      // Get tailed parlays
      const userTailedParlays = allParlays.filter((parlay) =>
        userParlayTails.some((tail) => tail.parlayId === parlay.id)
      );

      // Get all picks that are part of tailed parlays
      const parlayPickIds = userTailedParlays.flatMap(
        (parlay) => parlay.pickIds
      );
      const parlayPicks = allPicks.filter((pick) =>
        parlayPickIds.includes(pick.id)
      );

      setFavorites(tailedPicks);
      setParlayDetails(parlayPicks);
      setParlays(userTailedParlays);
      setAllTails(tails);
      setParlayTails(userParlayTails);
    });
  }, [currentUser]);

  useEffect(() => {
    getTailsByUserId(parseInt(currentUser)).then((userTails) => {
      setCurrentUserTails(userTails);
    });
  }, [allTails]);

  const handlePickTailBtn = async (event, pickId) => {
    event.preventDefault();
    const isTailing = currentUserTails.find((tail) => tail.pickId === pickId);

    if (!isTailing) {
      // Add new tail
      const tailToBePosted = {
        userId: parseInt(currentUser),
        pickId: pickId,
      };
      await postTail(tailToBePosted);
    } else {
      // Delete existing tail
      await deleteTail(isTailing.id);
    }
    refreshData();
  };

  const handleParlayTailBtn = async (event, parlayId) => {
    event.preventDefault();
    const isTailing = parlayTails.find((tail) => tail.parlayId === parlayId);

    if (!isTailing) {
      // Add new parlay tail
      const parlayTailToPost = {
        userId: parseInt(currentUser),
        parlayId: parlayId,
      };
      await postParlayTail(parlayTailToPost);
    } else {
      // Delete existing parlay tail
      await deleteParlayTail(isTailing.id);
    }
    refreshData();
  };

  const refreshData = () => {
    Promise.all([
      getAllPicks(),
      getAllParlays(),
      getAllTails(),
      getUserParlayTails(currentUser),
    ]).then(([allPicks, allParlays, tails, userParlayTails]) => {
      const userTails = tails.filter(
        (tail) => tail.userId === parseInt(currentUser)
      );

      const tailedPicks = allPicks.filter((pick) =>
        userTails.some((tail) => tail.pickId === pick.id)
      );

      const userTailedParlays = allParlays.filter((parlay) =>
        userParlayTails.some((tail) => tail.parlayId === parlay.id)
      );

      const parlayPickIds = userTailedParlays.flatMap(
        (parlay) => parlay.pickIds
      );
      const parlayPicks = allPicks.filter((pick) =>
        parlayPickIds.includes(pick.id)
      );

      setFavorites(tailedPicks);
      setParlayDetails(parlayPicks);
      setParlays(userTailedParlays);
      setAllTails(tails);
      setParlayTails(userParlayTails);
    });
  };

  return (
    <div className="picks-container">
      <ul className="picks-grid">
        {parlays.length > 0 && (
          <ParlayDisplay
            parlays={parlays}
            parlayDetails={parlayDetails}
            handleTailBtn={handleParlayTailBtn}
            currentUser={currentUser}
            currentUserTails={parlayTails}
          />
        )}

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
                  onClick={(event) => handlePickTailBtn(event, pick.id)}
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
