import { Link, useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css";

export const NavBar = ({ currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("badhabits_user"); // Remove pizza_user on logout

    navigate("/", { replace: true }); // Redirect to the homepage after logout
  };

  return (
    <nav>
      <ul>
        <li>
          <Link
            to="/makepicks"
            className={location.pathname === "/makepicks" ? "active" : ""}
          >
            <span>Make Picks</span>
          </Link>
        </li>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <span>All Picks</span>
          </Link>
        </li>
        <li>
          <Link
            to="/favoritepicks"
            className={location.pathname === "/favoritepicks" ? "active" : ""}
          >
            <span>Favorite Picks</span>
          </Link>
        </li>
        <li>
          <Link
            to="/mypicks"
            className={location.pathname === "/mypicks" ? "active" : ""}
          >
            <span>My Picks</span>
          </Link>
        </li>
        <li>
          <Link className="navbar-button" to="" onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};
