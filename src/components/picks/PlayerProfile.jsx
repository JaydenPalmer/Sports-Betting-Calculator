import { useEffect, useState } from "react";
import { getPlayerById } from "../../services/playerService";
import { getPositonById } from "../../services/positionService";

export const PlayerProfile = ({ selectedPlayer }) => {
  const [playerDetails, setPlayerDetails] = useState([]);
  const [playerPosition, setPlayerPosition] = useState([]);

  useEffect(() => {
    getPlayerById(selectedPlayer).then((player) => {
      setPlayerDetails(player);
    });
  }, [selectedPlayer]);

  useEffect(() => {
    getPositonById(playerDetails.positionId).then((player) => {
      setPlayerPosition(player);
    });
  }, [playerDetails]);

  return (
    <div className="player-profile">
      <h3>{playerDetails.name}</h3>
      <img
        src={playerDetails.profilePic}
        alt={
          playerDetails ? `${playerDetails?.name} headshot` : "player headshot"
        }
      />
      <h4>{playerPosition?.name}</h4>
      <h4>{playerDetails.team}</h4>
    </div>
  );
};
