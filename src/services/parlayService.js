export const getAllParlays = () => {
  return fetch("http://localhost:8088/parlays").then((res) => res.json());
};

export const postParlay = async (picks, parlayPercentage) => {
  // post the parlay
  const parlayObj = {
    userId: picks[0].userId,
    predictedPercentage: parlayPercentage,
  };

  const newParlay = await fetch("http://localhost:8088/parlays", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parlayObj),
  });
  const parlayResponse = await newParlay.json();

  //post all picks with parlayId
  const pickPromises = picks.map((pick) => {
    return fetch("http://localhost:8088/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...pick,
        parlayId: parlayResponse.id,
      }),
    });
  });

  return Promise.all(pickPromises);
};
