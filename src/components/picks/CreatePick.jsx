import { useEffect, useState } from "react";
import { getPlayerAverages, getPlayers } from "../../services/playerService";
import { getPositions } from "../../services/positionService";
import { getStats } from "../../services/statService";
import { PlayerProfile } from "./PlayerProfile";
import "./CreatePick.css";
import "./PlayerProfile.css";
import { BadhabitsPrediction } from "./BadHabitsPrediction";

export const CreatePick = ({ currentUser }) => {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [positons, setPositions] = useState([]);

  const [selectedPosition, setSelectedPosition] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [selectedStat, setSelectedStat] = useState(0);
  const [predictedValue, setPredictedValue] = useState("");
  const [selectedOverUnder, setSelectedOverUnder] = useState(null);

  const [predictedPercentage, setPredictedPercentage] = useState("");
  const [pick, setPick] = useState([]);

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

  useEffect(() => {
    const playerObj = players.find((player) => player.id === selectedPlayer);
    const statObj = stats.find((stat) => stat.id === selectedStat);

    if (
      playerObj?.espnId &&
      selectedPosition &&
      statObj?.name && // Changed this to use statObj
      selectedOverUnder &&
      predictedValue
    ) {
      const espnId = playerObj.espnId;
      const playerStats = statObj.name; // Use the stat name here
      const threshold = predictedValue;
      const overUnder = selectedOverUnder;

      getPlayerAverages(espnId, playerStats, threshold, overUnder).then(
        (percentage) => {
          setPredictedPercentage(percentage);
          console.log(percentage);
        }
      );
    }
  }, [
    selectedPlayer,
    selectedPosition,
    selectedStat,
    selectedOverUnder,
    predictedValue,
    players,
    stats, // Add stats to dependency array
  ]);

  const handleMakePickBtn = (event) => {
    event.preventDefault();
    if (
      selectedPlayer &&
      selectedPosition &&
      selectedStat &&
      selectedOverUnder &&
      predictedValue
    ) {
      const pickObj = {
        userId: currentUser,
        statId: selectedStat,
        playerId: selectedPlayer,
        predictedValue: predictedValue,
        isOver: selectedOverUnder === "Over" ? true : false,
        predictedPercentage: predictedPercentage,
      };

      console.log(pickObj);
      setPick(pickObj);
    }
  };

  return (
    <div className="content-wrapper">
      <section className="player-profile">
        {selectedPlayer ? (
          <PlayerProfile selectedPlayer={selectedPlayer} />
        ) : null}
      </section>
      <form className="pick-form">
        <h2 className="pick-form__title">Make Your Pick</h2>
        <div className="pick-form__container">
          <div className="pick-form__controls">
            <fieldset className="form-group">
              <label className="form-label">Select Position : </label>
              <select
                className="form-select"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(Number(e.target.value))}
              >
                <option value={0}>Select Position</option>
                {positons.map((position) => (
                  <option value={position.id} key={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="form-group" disabled={selectedPosition === 0}>
              <label className="form-label">Select Player : </label>
              <select
                className="form-select"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(Number(e.target.value))}
              >
                <option value={0}>Select Player</option>
                {players.map((player) => (
                  <option value={player.id} key={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="form-group" disabled={selectedPosition === 0}>
              <label className="form-label">Select Stat : </label>
              <select
                className="form-select"
                value={selectedStat}
                onChange={(e) => setSelectedStat(Number(e.target.value))}
              >
                <option value={0}>Select Stat</option>
                {stats.map((stat) => (
                  <option value={stat.id} key={stat.id}>
                    {stat.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="form-group" disabled={selectedPosition === 0}>
              <input
                type="number"
                step={0.5}
                className="form-input"
                placeholder="ex. 199.5"
                onChange={(e) => setPredictedValue(e.target.value)}
              />
            </fieldset>

            <div className="toggle-group ">
              <input
                type="radio"
                className="toggle-input"
                name="options"
                id="Under"
                autoComplete="off"
                checked={selectedOverUnder === "Under"}
                onChange={(e) => setSelectedOverUnder("Under")}
              />
              <label className="toggle-label" htmlFor="Under">
                Under
              </label>

              <input
                type="radio"
                className="toggle-input"
                name="options"
                id="Over"
                autoComplete="off"
                checked={selectedOverUnder === "Over"}
                onChange={(e) => setSelectedOverUnder("Over")}
              />
              <label className="toggle-label" htmlFor="Over">
                Over
              </label>
            </div>
          </div>
        </div>
      </form>
      <div className="prediction-card">
        {selectedPlayer &&
        selectedPosition &&
        selectedStat &&
        selectedOverUnder &&
        predictedValue ? (
          <>
            <BadhabitsPrediction
              selectedPlayer={Number(selectedPlayer)}
              predictedValue={String(predictedValue)}
              selectedOverUnder={String(selectedOverUnder)}
              selectedStat={Number(selectedStat)}
              predictedPercentage={Number(predictedPercentage)}
            />
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              onClick={handleMakePickBtn}
            >
              Post Pick
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};
