export const ParlayOrPick = ({ setParlayYesNo, parlayYesNo }) => {
  return (
    <div className="pick-form">
      <h1 className="pick-form__title">
        Would you like to calculate a Parlay or a Pick?
      </h1>
      <div className="toggle-group ">
        <input
          type="radio"
          className="toggle-input"
          name="options"
          id="Parlay"
          autoComplete="off"
          checked={parlayYesNo === "Parlay"}
          onChange={(e) => setParlayYesNo("Parlay")}
        />
        <label className="toggle-label" htmlFor="Parlay">
          Parlay
        </label>

        <input
          type="radio"
          className="toggle-input"
          name="options"
          id="Pick"
          autoComplete="off"
          checked={parlayYesNo === "Pick"}
          onChange={(e) => setParlayYesNo("Pick")}
        />
        <label className="toggle-label" htmlFor="Pick">
          Pick
        </label>
      </div>
    </div>
  );
};
