import { useEffect, useState } from "react";
import { getStatById } from "../../services/statService";
import { getPlayerById } from "../../services/playerService";
import "./BadhabitsPrediction.css";

export const BadhabitsPrediction = ({
  selectedPlayer,
  predictedValue,
  selectedOverUnder,
  selectedStat,
  predictedPercentage,
}) => {
  const [playerDetails, setPlayerDetails] = useState({});
  const [statName, setStatName] = useState({});

  useEffect(() => {
    getPlayerById(selectedPlayer).then((player) => {
      setPlayerDetails(player);
    });
    getStatById(selectedStat).then((stat) => {
      setStatName(stat);
    });
  }, [selectedPlayer, selectedStat]);

  return (
    <div>
      <h2 className="prediction-title">Bad Habits' Prediction</h2>
      <h3 className="player-name">{playerDetails?.name}</h3>
      <h3 className="prediction-details">
        <span className="text-capitalize">{selectedOverUnder}</span>
        <span>{predictedValue}</span>
        <span>{statName?.name}</span>
      </h3>
      <h1 className="prediction-percentage">{predictedPercentage}%</h1>
    </div>
  );
};
