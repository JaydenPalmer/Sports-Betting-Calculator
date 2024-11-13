export const getAllPicks = () => {
  return fetch(
    "http://localhost:8088/picks?_expand=player&_expand=stat&_expand=user"
  ).then((res) => res.json());
};

export const getPicksByUserId = (userId) => {
  return fetch(``);
};
