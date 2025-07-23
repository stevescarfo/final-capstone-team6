import React from "react";

export function LoginForm(params) {
  const handleChange = (event) => {
    let newCredentials = { ...params.credentials };
    newCredentials[event.target.name] = event.target.value;
    params.setCredentials(newCredentials);
  };

  const titleStyle = {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px",
    textAlign: "center",
    marginBottom: "10px",
    borderRadius: "4px"
  };

  // Container for inputs and button, with button pushed to the right
  const formRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  };

  // Container for labels and inputs stacked vertically
  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '120px'
  };

  // Button container to push button to right
  const buttonContainerStyle = {
    marginLeft: 'auto',
  };

  return (
    <div className="box" style={{ maxWidth: "400px", width: "100%" }}>
      <h2 style={titleStyle}>User Login</h2>
      <form style={formRowStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="user">User:</label>
          <input
            type="text"
            size={10}
            id="user"
            name="user"
            value={params.credentials.user}
            onChange={handleChange}
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            size={10}
            id="password"
            name="password"
            value={params.credentials.password}
            onChange={handleChange}
          />
        </div>

        <div style={buttonContainerStyle}>
          <button type="button" onClick={params.login}>
            {(params.currentUser) ? "Logout" : "Login"}
          </button>
        </div>
      </form>
      <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
        User: {(params.currentUser) ? params.currentUser.user : "not logged in"}
      </div>
    </div>
  );
}
