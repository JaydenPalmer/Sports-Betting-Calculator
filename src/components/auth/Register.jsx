import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { createUser, getUserByEmail } from "../../services/userService";

export const Register = (props) => {
  const [user, setUser] = useState({
    email: "",
    fullName: "",
  });
  let navigate = useNavigate();

  const registerNewUser = () => {
    const newUser = {
      ...user,
      cohort: parseInt(user.cohort),
    };

    createUser(newUser).then((createdUser) => {
      if (createdUser.hasOwnProperty("id")) {
        localStorage.setItem(
          "badhabits_user",
          JSON.stringify({
            id: createdUser.id,
          })
        );

        navigate("/");
      }
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    getUserByEmail(user.email).then((response) => {
      if (response.length > 0) {
        // Duplicate email. No good.
        window.alert("Account with that email address already exists");
      } else {
        // Good email, create user.
        registerNewUser();
      }
    });
  };

  const updateUser = (evt) => {
    const copy = { ...user };
    copy[evt.target.id] = evt.target.value;
    setUser(copy);
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <form className="login-form" onSubmit={handleRegister}>
          <h1 className="login-brand">Bad Habits</h1>
          <h2 className="login-subtitle">Please Register</h2>
          <fieldset className="login-input-group">
            <div>
              <input
                onChange={updateUser}
                type="text"
                id="fullName"
                className="login-input"
                placeholder="Enter your name"
                required
                autoFocus
              />
            </div>
          </fieldset>
          <fieldset className="login-input-group">
            <div>
              <input
                onChange={updateUser}
                type="email"
                id="email"
                className="login-input"
                placeholder="Email address"
                required
              />
            </div>
          </fieldset>
          <fieldset className="login-input-group">
            <div>
              <button className="login-button" type="submit">
                Register
              </button>
            </div>
          </fieldset>
        </form>
        <section className="login-signup">
          <Link to="/login">Already have an account?</Link>
        </section>
      </section>
    </main>
  );
};
