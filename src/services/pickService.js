export const getAllPicks = () => {
  return fetch(
    "http://localhost:8088/picks?_expand=player&_expand=stat&_expand=user"
  ).then((res) => res.json());
};

export const getPickById = (pickId) => {
  return fetch(`http://localhost:8088/picks/${pickId}`).then((res) =>
    res.json()
  );
};

export const updatePick = (pickId, updatedPick) => {
  return fetch(`http://localhost:8088/picks/${pickId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPick),
  });
};
