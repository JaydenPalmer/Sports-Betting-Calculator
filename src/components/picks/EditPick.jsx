import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPickById, updatePick } from "../../services/pickService";
import { getPlayerAverages, getPlayers } from "../../services/playerService";
import { getPositions } from "../../services/positionService";
import { getStats } from "../../services/statService";
import "./CreatePick.css";
import { PlayerProfile } from "./PlayerProfile";
import { BadhabitsPrediction } from "./BadHabitsPrediction";

export const EditPick = ({ currentUser }) => {
  const { pickId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [positons, setPositions] = useState([]);

  const [selectedPosition, setSelectedPosition] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [selectedStat, setSelectedStat] = useState(0);
  const [predictedValue, setPredictedValue] = useState("");
  const [selectedOverUnder, setSelectedOverUnder] = useState(null);

  const [predictedPercentage, setPredictedPercentage] = useState("");
  const [currentPick, setCurrentPick] = useState([]);

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
    getPickById(pickId).then((p) => {
      setCurrentPick(p);
      setSelectedPlayer(p.playerId);
      setSelectedPosition(1);
      setSelectedStat(p.statId);
      setPredictedValue(p.predictedValue);
      setPredictedPercentage(p.predictedPercentage);
      setSelectedOverUnder(p.isOver ? "Over" : "Under");
    });
  }, []);

  const handleCalculateBtn = (event) => {
    event.preventDefault();
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
    } else {
      window.alert(
        "Please be sure to finish your pick before attempting to calculate!"
      );
    }
  };

  const handleUpdatePickBtn = (event) => {
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
        isOver: selectedOverUnder === "Over",
        predictedPercentage: predictedPercentage,
      };

      updatePick(pickId, pickObj).then(() => navigate("/mypicks"));
    } else {
      window.alert("Please Be Sure To Fill Out The Whole Form");
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
                value={predictedValue}
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
              onClick={handleUpdatePickBtn}
            >
              Update Pick
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};
