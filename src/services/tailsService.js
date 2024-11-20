export const getAllTails = () => {
  return fetch("http://localhost:8088/tails").then((res) => res.json());
};

export const getTailsByUserId = (userId) => {
  return fetch(`http://localhost:8088/tails?userId=${userId}`).then((res) =>
    res.json()
  );
};

export const postTail = (tail) => {
  return fetch(`http://localhost:8088/tails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tail),
  });
};

export const deleteTail = (tailId) => {
  console.log("DELETE TAIL CALLED WITH ID:", tailId);
  return fetch(`http://localhost:8088/tails/${tailId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Delete failed");
    }
  });
};
