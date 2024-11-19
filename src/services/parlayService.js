export const getAllParlays = () => {
  return fetch("http://localhost:8088/parlays").then((res) => res.json());
};
