export const getAllTails = () => {
  return fetch("http://localhost:8088/tails").then((res) => res.json());
};

export const getTailsByUserId = (userId) => {
  return fetch(`http://localhost:8088/tails?userId=${userId}`).then((res) =>
    res.json()
  );
};

export const postTail = async (tailObj) => {
  return await fetch("http://localhost:8088/tails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tailObj),
  });
};

export const deleteTail = async (tailId) => {
  return await fetch(`http://localhost:8088/tails/${tailId}`, {
    method: "DELETE",
  });
};

export const postParlayTail = async (parlayTailObj) => {
  return await fetch("http://localhost:8088/parlayTails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parlayTailObj),
  });
};

export const deleteParlayTail = async (parlayTailId) => {
  return await fetch(`http://localhost:8088/parlayTails/${parlayTailId}`, {
    method: "DELETE",
  });
};
