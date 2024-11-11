export const getStats = () => {
  return fetch("http://localhost:8088/stats").then((res) => res.json());
};
