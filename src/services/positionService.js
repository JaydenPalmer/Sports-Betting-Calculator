export const getPositions = () => {
  return fetch("http://localhost:8088/positions").then((res) => res.json());
};

export const getPositonById = (positionId) => {
  return fetch(`http://localhost:8088/positions/${positionId}`).then((res) =>
    res.json()
  );
};
