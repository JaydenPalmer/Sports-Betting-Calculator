import { useEffect, useState } from "react";
import { deleteTail, getTailsByUserId } from "../../services/tailsService";
import { getAllPicks } from "../../services/pickService";
import { Link } from "react-router-dom";

export const FavoritePicks = ({ currentUser }) => {
  const [favorites, setFavorites] = useState([]);
  const [currentUserTails, setCurrentUserTails] = useState([]);

  // Initial load
  useEffect(() => {
    Promise.all([
      fetch(
        "http://localhost:8088/picks?_expand=player&_expand=stat&_expand=user"
      ).then((res) => res.json()),
      fetch(`http://localhost:8088/tails?userId=${currentUser}`).then((res) =>
        res.json()
      ),
    ]).then(([allPicks, userTails]) => {
      const filteredPicks = allPicks.filter((pick) =>
        userTails.some((tail) => tail.pickId === pick.id)
      );
      setFavorites(filteredPicks);
      setCurrentUserTails(userTails);
    });
  }, [currentUser]);

  const handleTailBtn = async (event, pickId) => {
    event.preventDefault();

    try {
      // Find the specific tail
      const tailToDelete = currentUserTails.find(
        (tail) =>
          tail.pickId === pickId && tail.userId === parseInt(currentUser)
      );

      if (tailToDelete) {
        // Only make the delete request
        const deleteResponse = await fetch(
          `http://localhost:8088/tails/${tailToDelete.id}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error("Failed to delete tail");
        }

        // Only get tails for current user
        const newTailsResponse = await fetch(
          `http://localhost:8088/tails?userId=${currentUser}`
        );
        const newTails = await newTailsResponse.json();

        // Get all picks again
        const newPicksResponse = await fetch(
          "http://localhost:8088/picks?_expand=player&_expand=stat&_expand=user"
        );
        const allPicks = await newPicksResponse.json();

        // Filter favorites based on new tails
        const newFavorites = allPicks.filter((pick) =>
          newTails.some((tail) => tail.pickId === pick.id)
        );

        setCurrentUserTails(newTails);
        setFavorites(newFavorites);
      }
    } catch (error) {
      console.error("Error:", error);
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
