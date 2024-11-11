export const getPlayers = () => {
  return fetch("http://localhost:8088/players").then((res) => res.json());
};

export const getPlayerById = (playerId) => {
  return fetch(`http://localhost:8088/players/${playerId}`).then((res) =>
    res.json()
  );
};
