export const getAllParlays = () => {
  return fetch("http://localhost:8088/parlays").then((res) => res.json());
};

export const postParlay = async (picks, parlayPercentage) => {
  // Post all picks first
  const pickPromises = picks.map((pick) =>
    fetch("http://localhost:8088/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pick),
    }).then((res) => res.json())
  );

  const postedPicks = await Promise.all(pickPromises);

  // Create parlay with pick IDs
  const parlayObj = {
    userId: picks[0].userId,
    predictedPercentage: parlayPercentage,
    pickIds: postedPicks.map((pick) => pick.id),
  };

  return fetch("http://localhost:8088/parlays", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parlayObj),
  }).then((res) => res.json());
};

export const deleteParlay = async (parlayId, pickIds) => {
  console.log("Deleting parlay:", parlayId);
  console.log("Deleting picks:", pickIds);

  // Delete all picks in the parlay
  await Promise.all(
    pickIds.map((pickId) =>
      fetch(`http://localhost:8088/picks/${pickId}`, { method: "DELETE" })
    )
  );

  // Delete the parlay itself
  return fetch(`http://localhost:8088/parlays/${parlayId}`, {
    method: "DELETE",
  });
};
