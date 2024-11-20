export const PickForm = ({
  selectedOverUnder,
  selectedPlayer,
  selectedPosition,
  selectedStat,
  handleCalculateBtn,
  players,
  stats,
  setPredictedValue,
  positons,
  setSelectedPosition,
  setSelectedPlayer,
  setSelectedStat,
  setSelectedOverUnder,
  predictedValue,
  parlayYesNo,
}) => {
  return (
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
            value={predictedValue}
            onChange={(e) => setPredictedValue(parseFloat(e.target.value))}
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
  );
};
