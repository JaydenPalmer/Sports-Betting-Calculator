import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CreatePick } from "../components/picks/CreatePick";

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const localPizzaUser = localStorage.getItem("badhabits_user");
    if (localPizzaUser) {
      const pizzaUserObject = JSON.parse(localPizzaUser);
      setCurrentUser(pizzaUserObject);
    }
  }, []);

  return (
    <Routes>
      <Route path="/createpicks" element={<CreatePick />} />
    </Routes>
  );
};
