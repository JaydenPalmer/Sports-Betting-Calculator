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
import { PickForm } from "./PickForm";
import { ParlayOrPick } from "./ParlayOrPick";
import { getAllParlays, postParlay } from "../../services/parlayService";
import { ParlayCart } from "../parlays/ParlayCart";

export const CreatePick = ({ currentUser }) => {
  //initial state of available options
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [positons, setPositions] = useState([]);
  const [parlays, setParlays] = useState([]);

  //user input
  const [parlayYesNo, setParlayYesNo] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [selectedStat, setSelectedStat] = useState(0);
  const [predictedValue, setPredictedValue] = useState("");
  const [selectedOverUnder, setSelectedOverUnder] = useState(null);
  const [handleCalc, setHandleCalc] = useState(false);

  //api calculation
  const [predictedPercentage, setPredictedPercentage] = useState("");

  //parlay state to display
  const [currentParlay, setCurrentParlay] = useState([]);
  const [parlayPercentage, setParlayPercentage] = useState([]);

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
    getAllParlays().then((p) => {
      setParlays(p);
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
        userId: parseInt(currentUser),
        statId: parseInt(selectedStat),
        playerId: parseInt(selectedPlayer),
        predictedValue: parseFloat(predictedValue),
        isOver: selectedOverUnder === "Over" ? true : false,
        predictedPercentage: parseInt(predictedPercentage),
        parlayId: 0,
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

  const handleAddToParlay = (event) => {
    event.preventDefault();
    if (
      selectedPlayer &&
      selectedPosition &&
      selectedStat &&
      selectedOverUnder &&
      predictedValue
    ) {
      const pickObj = {
        userId: parseInt(currentUser),
        statId: parseInt(selectedStat),
        playerId: parseInt(selectedPlayer),
        predictedValue: parseFloat(predictedValue),
        isOver: selectedOverUnder === "Over" ? true : false,
        predictedPercentage: parseInt(predictedPercentage),
      };
      console.log(pickObj);
      setCurrentParlay((prevParlay) => [...prevParlay, pickObj]);
      setSelectedPlayer(0);
      setSelectedStat(0);
      setSelectedPosition(0);
      setSelectedOverUnder(null);
      setPredictedValue("");
      setPredictedPercentage("");
    }
  };

  const handlePostParlayBtn = (event) => {
    event.preventDefault();
    if (currentParlay.length > 1) {
      postParlay(currentParlay, parlayPercentage)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error posting parlay:", error);
          window.alert("Failed to submit parlay");
        });
    } else {
      window.alert("A PARLAY MUST HAVE MORE THAN 1 PICK");
    }
  };

  return (
    <div className="content-wrapper">
      {selectedPlayer ? (
        <section className="player-profile">
          <PlayerProfile selectedPlayer={selectedPlayer} />
        </section>
      ) : null}
      {parlayYesNo ? null : (
        <ParlayOrPick
          setParlayYesNo={setParlayYesNo}
          parlayYesNo={parlayYesNo}
        />
      )}
      {parlayYesNo ? (
        <form className="pick-form">
          <h2 className="pick-form__title">Make Your Pick</h2>
          <PickForm
            selectedOverUnder={selectedOverUnder}
            selectedPlayer={selectedPlayer}
            selectedPosition={selectedPosition}
            selectedStat={selectedStat}
            handleCalculateBtn={handleCalculateBtn}
            players={players}
            stats={stats}
            setPredictedValue={setPredictedValue}
            positons={positons}
            setSelectedPosition={setSelectedPosition}
            setSelectedPlayer={setSelectedPlayer}
            setSelectedStat={setSelectedStat}
            setSelectedOverUnder={setSelectedOverUnder}
            predictedValue={predictedValue}
            parlayYesNo={parlayYesNo}
          />
        </form>
      ) : null}

      {currentParlay.length > 0 ? (
        <div className="parlay-container">
          {" "}
          <ParlayCart
            parlays={currentParlay}
            setParlayPercentage={setParlayPercentage}
          />{" "}
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            onClick={handlePostParlayBtn}
          >
            Post Parlay
          </button>
        </div>
      ) : null}

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
            parlayYesNo={parlayYesNo}
          />
          {parlayYesNo === "Pick" ? (
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              onClick={handleMakePickBtn}
            >
              Post Pick
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              onClick={handleAddToParlay}
            >
              Add To Parlay
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};
