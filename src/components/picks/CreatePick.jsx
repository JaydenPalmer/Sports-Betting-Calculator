import { useEffect, useState } from "react";
import { getPlayerAverages, getPlayers } from "../../services/playerService";
import { getPositions } from "../../services/positionService";
import { getStats } from "../../services/statService";
import { PlayerProfile } from "./PlayerProfile";
import "./CreatePick.css";
import "./PlayerProfile.css";
import { BadhabitsPrediction } from "./BadHabitsPrediction";
import { postPick } from "../../services/pickService";
import { useNavigate } from "react-router-dom";

export const CreatePick = ({ currentUser }) => {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [positons, setPositions] = useState([]);

  const [selectedPosition, setSelectedPosition] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [selectedStat, setSelectedStat] = useState(0);
  const [predictedValue, setPredictedValue] = useState("");
  const [selectedOverUnder, setSelectedOverUnder] = useState(null);
  const [handleCalc, setHandleCalc] = useState(false);

  const [predictedPercentage, setPredictedPercentage] = useState("");

  const navigate = useNavigate();

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
    setHandleCalc(false);
  }, [
    selectedOverUnder,
    selectedPlayer,
    selectedPosition,
    selectedStat,
    predictedValue,
  ]);

  const handleCalculateBtn = (event) => {
    event.preventDefault();
    setHandleCalc(true);
    const playerObj = players.find((player) => player.id === selectedPlayer);
    const statObj = stats.find((stat) => stat.id === selectedStat);

    if (
      playerObj?.espnId &&
      selectedPosition &&
      statObj?.name &&
      selectedOverUnder &&
      predictedValue
    ) {
      const espnId = playerObj.espnId;
      const playerStats = statObj.name;
      const threshold = predictedValue;
      const overUnder = selectedOverUnder;

      getPlayerAverages(espnId, playerStats, threshold, overUnder).then(
        (percentage) => {
          setPredictedPercentage(percentage);
          console.log(percentage);
        }
      );
    } else {
      window.alert(
        "Please be sure to finish your pick before attempting to calculate!"
      );
    }
  };

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

      postPick(pickObj)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error posting pick:", error);
        });
    }
  };

  return (
    <div className="content-wrapper">
      {selectedPlayer ? (
        <section className="player-profile">
          <PlayerProfile selectedPlayer={selectedPlayer} />
        </section>
      ) : null}
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
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={handleCalculateBtn}
          >
            Calculate Badhabits Prediction
          </button>
        </div>
      </form>
      {selectedPlayer &&
      selectedPosition &&
      selectedStat &&
      selectedOverUnder &&
      predictedValue &&
      handleCalc ? (
        <div className="prediction-card">
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
        </div>
      ) : null}
    </div>
  );
};
