import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { getUserByEmail } from "../../services/userService";

export const Login = () => {
  const [email, set] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    return getUserByEmail(email).then((foundUsers) => {
      if (foundUsers.length === 1) {
        const user = foundUsers[0];
        localStorage.setItem(
          "badhabits_user",
          JSON.stringify({
            id: user.id,
          })
        );

        navigate("/");
      } else {
        window.alert("Invalid login");
      }
    });
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <form className="login-form" onSubmit={handleLogin}>
          <h1 className="login-brand">Bad Habits</h1>
          <h2 className="login-subtitle">Please sign in</h2>
          <fieldset className="login-input-group">
            <div>
              <input
                type="email"
                value={email}
                className="login-input"
                onChange={(evt) => set(evt.target.value)}
                placeholder="Email address"
                required
                autoFocus
              />
            </div>
          </fieldset>
          <fieldset className="login-input-group">
            <div>
              <button className="login-button" type="submit">
                Sign in
              </button>
            </div>
          </fieldset>
        </form>
        <section className="login-signup">
          <Link to="/register">Not a member yet?</Link>
        </section>
      </section>
    </main>
  );
};
