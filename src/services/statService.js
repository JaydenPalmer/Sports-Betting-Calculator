export const getStats = () => {
  return fetch("http://localhost:8088/stats").then((res) => res.json());
};

export const getStatById = (statId) => {
  return fetch(`http://localhost:8088/stats/${statId}`).then((res) =>
    res.json()
  );
};
