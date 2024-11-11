export const getPositions = () => {
  return fetch("http://localhost:8088/positions").then((res) => res.json());
};
