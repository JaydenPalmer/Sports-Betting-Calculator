import { useEffect, useState } from "react";
import { getPlayers } from "../../services/playerService";
import { getPositions } from "../../services/positionService";
import { getStats } from "../../services/statService";
import { PlayerProfile } from "./PlayerProfile";
import "./CreatePick.css";
import "./PlayerProfile.css";

export const CreatePick = () => {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [positons, setPositions] = useState([]);

  const [selectedPosition, setSelectedPosition] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [selectedStat, setSelectedStat] = useState(0);
  const [selected, setSelected] = useState(null);

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

  return (
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
            />
          </fieldset>

          <div className="toggle-group">
            <input
              type="radio"
              className="toggle-input"
              name="options"
              id="under"
              autoComplete="off"
              checked={selected === "under"}
              onChange={(e) => setSelected("under")}
            />
            <label className="toggle-label" htmlFor="under">
              Under
            </label>

            <input
              type="radio"
              className="toggle-input"
              name="options"
              id="over"
              autoComplete="off"
              checked={selected === "over"}
              onChange={(e) => setSelected("over")}
            />
            <label className="toggle-label" htmlFor="over">
              Over
            </label>
          </div>
        </div>
      </div>

      <section className="player-section">
        {selectedPlayer ? (
          <PlayerProfile selectedPlayer={selectedPlayer} />
        ) : null}
      </section>
    </form>
  );
};
