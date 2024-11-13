export const getPlayers = () => {
  return fetch("http://localhost:8088/players").then((res) => res.json());
};

export const getPlayerById = (playerId) => {
  return fetch(`http://localhost:8088/players/${playerId}`).then((res) =>
    res.json()
  );
};

export const getPlayerAverages = async (
  espnId,
  playerStats,
  threshold,
  overUnder
) => {
  if (!espnId || !playerStats) {
    console.error("Missing required parameters");
    return null;
  }

  try {
    const response = await fetch(
      `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes/${espnId}/statistics`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const splits = data.splits.categories;
    const passingStats =
      splits.find((cat) => cat.name === "passing")?.stats || [];
    const rushingStats =
      splits.find((cat) => cat.name === "rushing")?.stats || [];

    // Get games played
    const totalYards =
      passingStats.find((stat) => stat.name === "passingYards")?.value || 0;
    const yardsPerGame =
      passingStats.find((stat) => stat.name === "passingYardsPerGame")?.value ||
      0;
    const gamesPlayed = Math.round(totalYards / yardsPerGame);

    // Get the average for the requested stat
    const averages = {
      "Passing Yards":
        passingStats.find((stat) => stat.name === "passingYardsPerGame")
          ?.value || 0,
      "Passing Touchdowns": Number(
        (
          passingStats.find((stat) => stat.name === "passingTouchdowns")
            ?.value / gamesPlayed
        ).toFixed(2)
      ),
      "Rushing Yards":
        rushingStats.find((stat) => stat.name === "rushingYardsPerGame")
          ?.value || 0,
      "Rushing Touchdowns": Number(
        (
          rushingStats.find((stat) => stat.name === "rushingTouchdowns")
            ?.value / gamesPlayed
        ).toFixed(2)
      ),
      Interceptions: Number(
        (
          passingStats.find((stat) => stat.name === "interceptions")?.value /
          gamesPlayed
        ).toFixed(2)
      ),
    };

    // Calculate a more dynamic probability based on deviation from average
    const calculateProbability = (average, threshold, statType) => {
      let deviation = Math.abs(threshold - average);
      let baseProb = 50; // Start at 50%
      let percentChange;

      switch (statType) {
        case "Passing Yards":
          // Every 25 yards away from average changes probability by ~8%
          percentChange = (deviation / 25) * 8;
          break;

        case "Passing Touchdowns":
        case "Rushing Touchdowns":
          // Every 0.25 TDs away from average changes probability by ~12%
          percentChange = (deviation / 0.25) * 12;
          break;

        case "Rushing Yards":
          // Every 10 yards away from average changes probability by ~10%
          percentChange = (deviation / 10) * 10;
          break;

        case "Interceptions":
          // Every 0.2 INTs away from average changes probability by ~15%
          percentChange = (deviation / 0.2) * 15;
          break;
      }

      // If threshold is below average and we want over, or
      // threshold is above average and we want under, add to base probability
      const shouldAdd =
        (threshold < average && overUnder === "Over") ||
        (threshold > average && overUnder === "Under");

      let finalProb = shouldAdd
        ? baseProb + percentChange
        : baseProb - percentChange;

      // Cap probability between 1 and 99
      return Math.min(Math.max(Math.round(finalProb), 1), 99);
    };

    const average = averages[playerStats];
    console.log("Average:", average);
    console.log("Threshold:", threshold);
    console.log("Stat Type:", playerStats);
    console.log("Over/Under:", overUnder);

    const probability = calculateProbability(average, threshold, playerStats);
    console.log("Calculated Probability:", probability);

    return probability;
  } catch (error) {
    console.error("Error calculating probability:", error);
    return null;
  }
};
