export const getTailsByUserId = (userId) => {
  return fetch(`http://localhost:8088/tails?userId=${userId}`).then((res) =>
    res.json()
  );
};
