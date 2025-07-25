import React from "react";
import "./LoginForm.css"; // Make sure this CSS file exists and includes the necessary styles

export function LoginForm(params) {
  const handleChange = (event) => {
    let newCredentials = { ...params.credentials };
    newCredentials[event.target.name] = event.target.value;
    params.setCredentials(newCredentials);
  };

  return (
    <div className="box login-box">
      <h2 className="section-title">User Login</h2>
      <form className="login-form-row" onSubmit={(e) => e.preventDefault()}>
        <div className="login-input-group">
          <label htmlFor="user">User:</label>
          <input
            type="text"
            id="user"
            name="user"
            value={params.credentials.user}
            onChange={handleChange}
            disabled={!!params.currentUser}
          />
        </div>

        <div className="login-input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={params.credentials.password}
            onChange={handleChange}
            disabled={!!params.currentUser}
          />
        </div>

        <div className="login-action-container">
          <button type="submit" className="submit-button" onClick={params.login}>
            {params.currentUser ? "Logout" : "Login"}
          </button>
          <div className="login-status">
            Current User: {params.currentUser ? params.currentUser.user : "not logged in"}
          </div>
        </div>
      </form>
    </div>
  );
}
