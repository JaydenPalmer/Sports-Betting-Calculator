import { useEffect, useState } from "react";
import { getPlayers } from "../../services/playerService";
import { getPositions } from "../../services/positionService";
import { getStats } from "../../services/statService";

export const CreatePick = () => {
  const [players, setPlayers] = useState({});
  const [stats, setStats] = useState({});
  const [postions, setPositions] = useState({});

  useEffect(() => {
    getPlayers().then((p) => {
      setPlayers(p);
    });
    getPositions().then((p) => {
      setPositions(p);
    });
    getStats().then((s) => {
      setStats(s);
    });
  }, []);

  return <div>Create Picks</div>;
};
