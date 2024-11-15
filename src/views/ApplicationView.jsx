import { useEffect, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { CreatePick } from "../components/picks/CreatePick";
import { NavBar } from "../components/navbar/NavBar";
import { AllPicks } from "../components/picks/AllPicks";
import { MyPicks } from "../components/picks/My Picks";
import { FavoritePicks } from "../components/picks/FavoritePicks";
import { EditPick } from "../components/picks/EditPick";
import { AnimatedBackground } from "../components/animations/background";

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const localBadhabitsUser = localStorage.getItem("badhabits_user");
    if (localBadhabitsUser) {
      const badhabitsUserObject = JSON.parse(localBadhabitsUser);
      setCurrentUser(badhabitsUserObject.id);
    }
  }, []);

  const NavBarLayout = () => {
    return (
      <>
        <NavBar />
        <AnimatedBackground />
        <Outlet />
      </>
    );
  };

  return (
    <Routes>
      <Route element={<NavBarLayout currentUser={currentUser} />}>
        <Route index element={<AllPicks currentUser={currentUser} />} />
        <Route
          path="/makepicks"
          element={<CreatePick currentUser={currentUser} />}
        />
        <Route
          path="/favoritepicks"
          element={<FavoritePicks currentUser={currentUser} />}
        />
        <Route
          path="/mypicks"
          element={<MyPicks currentUser={currentUser} />}
        />
        <Route
          path="/mypicks/:pickId"
          element={<EditPick currentUser={currentUser} />}
        />
      </Route>
    </Routes>
  );
};
