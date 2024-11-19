import { useEffect, useState } from "react";
import { getStatById } from "../../services/statService";
import { getPlayerById } from "../../services/playerService";
import "./ParlayCart.css";

export const ParlayCart = ({ parlays }) => {
  const [players, setPlayers] = useState({});
  const [stats, setStats] = useState({});

  // Calculate parlay percentage
  const parlayPercentage = Math.round(
    parlays.reduce(
      (product, pick) => product * (Number(pick.predictedPercentage) / 100),
      1
    ) * 100
  );

  useEffect(() => {
    const uniquePlayerIds = [...new Set(parlays.map((pick) => pick.playerId))];
    const uniqueStatIds = [...new Set(parlays.map((pick) => pick.statId))];

    uniquePlayerIds.forEach((playerId) => {
      getPlayerById(playerId).then((player) => {
        setPlayers((prev) => ({ ...prev, [playerId]: player }));
      });
    });

    uniqueStatIds.forEach((statId) => {
      getStatById(statId).then((stat) => {
        setStats((prev) => ({ ...prev, [statId]: stat }));
      });
    });
  }, [parlays]);

  return (
    <>
      {parlays.length > 0 ? (
        <div className="parlay-container">
          <h2 className="parlay-title">Bad Habits' Parlay</h2>
          <h2 className="parlay-main-percentage">{parlayPercentage}% Chance</h2>
          <div className="parlay-picks-container">
            {parlays.map((pick) => (
              <div
                className="parlay-pick-card"
                key={`${pick.playerId}-${pick.statId}`}
              >
                <h3 className="parlay-player-name">
                  {players[pick.playerId]?.name}
                </h3>
                <div className="parlay-pick-details">
                  <span className="text-capitalize">
                    {pick.isOver ? "Over" : "Under"}
                  </span>
                  <span>{pick.predictedValue}</span>
                  <span>{stats[pick.statId]?.name}</span>
                </div>
                <div className="parlay-pick-percentage">
                  {pick.predictedPercentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-parlay">
          <h2>No Picks Added Yet</h2>
        </div>
      )}
    </>
  );
};
