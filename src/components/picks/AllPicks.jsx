import { useEffect, useState } from "react";
import { deletePick, getAllPicks, postPick } from "../../services/pickService";
import "./AllPicks.css";
import {
  deleteParlayTail,
  deleteTail,
  getAllTails,
  getTailsByUserId,
  postParlayTail,
  postTail,
} from "../../services/tailsService";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteParlay,
  getAllParlays,
  getUserParlayTails,
} from "../../services/parlayService";
import { ParlayDisplay } from "../parlays/ParlayDisplay";

export const AllPicks = ({ currentUser }) => {
  const [picks, setPicks] = useState([]);
  const [parlays, setParlays] = useState([]);
  const [parlayDetails, setParlayDetails] = useState([]);
  const [allTails, setAllTails] = useState([]);
  const [currentUserTails, setCurrentUserTails] = useState([]);
  const [parlayTails, setParlayTails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getAllPicks(),
      getAllParlays(),
      getAllTails(),
      getUserParlayTails(currentUser),
    ]).then(([allPicks, allParlays, tails, userParlayTails]) => {
      // Split picks into parlay and non-parlay
      const parlayPickIds = allParlays.flatMap((parlay) => parlay.pickIds);
      const parlayPicks = allPicks.filter((pick) =>
        parlayPickIds.includes(pick.id)
      );
      const singlePicks = allPicks.filter(
        (pick) => !parlayPickIds.includes(pick.id)
      );

      setPicks(singlePicks);
      setParlayDetails(parlayPicks);
      setParlays(allParlays);
      setAllTails(tails);
      setParlayTails(userParlayTails);
    });
  }, [currentUser]);

  useEffect(() => {
    getTailsByUserId(parseInt(currentUser)).then((userTails) => {
      setCurrentUserTails(userTails);
    });
  }, [allTails]);

  const refreshData = () => {
    Promise.all([
      getAllPicks(),
      getAllParlays(),
      getAllTails(),
      getUserParlayTails(currentUser),
    ]).then(([allPicks, allParlays, tails, userParlayTails]) => {
      const parlayPickIds = allParlays.flatMap((parlay) => parlay.pickIds);
      const parlayPicks = allPicks.filter((pick) =>
        parlayPickIds.includes(pick.id)
      );
      const singlePicks = allPicks.filter(
        (pick) => !parlayPickIds.includes(pick.id)
      );

      setPicks(singlePicks);
      setParlayDetails(parlayPicks);
      setParlays(allParlays);
      setAllTails(tails);
      setParlayTails(userParlayTails);

      getTailsByUserId(parseInt(currentUser)).then((userTails) => {
        setCurrentUserTails(userTails);
      });
    });
  };

  // Handler for regular pick tails
  const handlePickTailBtn = async (event, pickId) => {
    event.preventDefault();
    const isTailing = currentUserTails.find((tail) => tail.pickId === pickId);

    if (!isTailing) {
      const tailToBePosted = {
        userId: parseInt(currentUser),
        pickId: parseInt(pickId),
      };
      await postTail(tailToBePosted);
    } else {
      await deleteTail(isTailing.id);
    }
    const updatedTails = await getAllTails();
    setAllTails(updatedTails);
  };

  // Handler for parlay tails
  const handleParlayTailBtn = async (event, parlayId) => {
    event.preventDefault();
    const isTailing = parlayTails.find((tail) => tail.parlayId === parlayId);

    if (!isTailing) {
      const parlayTailToPost = {
        userId: parseInt(currentUser),
        parlayId: parlayId,
      };
      await postParlayTail(parlayTailToPost);
    } else {
      await deleteParlayTail(isTailing.id);
    }
    refreshData();
  };

  const handleEditBtn = (pickId) => {
    navigate(`/mypicks/${pickId}`);
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
            handleEditBtn={handleEditBtn}
            handleTailBtn={handleParlayTailBtn}
            deleteParlayBtn={deleteParlayBtn}
            currentUser={currentUser}
            currentUserTails={parlayTails}
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
                <Link to={`/userprofile/${pick.userId}`}>
                  <span className="user-name">{pick.user.name}</span>
                </Link>
                <div className="button-container">
                  {parseInt(currentUser) !== pick.userId ? (
                    <button
                      className="tail-button"
                      onClick={(event) => handlePickTailBtn(event, pick.id)}
                    >
                      {currentUserTails.find((tail) => tail.pickId === pick.id)
                        ? "Trash"
                        : "Tail"}
                    </button>
                  ) : (
                    <div className="button-container">
                      <button
                        className="edit-button"
                        onClick={() => handleEditBtn(pick.id)}
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
                  )}
                </div>
              </footer>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
