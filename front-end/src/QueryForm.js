import React from "react";
import "./QueryForm.css"; // Make sure this CSS file exists with the styles provided

export function QueryForm(params) {
  // Handles changes to any input/select field
  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormObject = { ...params.formObject, [name]: value };
    params.setFormObject(newFormObject);
  };

  const onSubmitClick = (event) => {
    event.preventDefault();
    if (!params.formObject.queryName) {
      alert("please provide a name for the query!");
      return;
    }
    if (!params.formObject.q || params.formObject.q.length === 0) {
      alert("please provide some text for the query field!");
      return;
    }
    params.submitToParent(params.formObject);
  };

  // Checks if current user is admin
  function currentUserIsAdmin() {
    return params.currentUser?.user === "admin";
  }

  return (
    <form onSubmit={onSubmitClick}>
      <div className="query-form-group">
        <label htmlFor="queryName">Query Name:</label>
        <input
          type="text"
          id="queryName"
          name="queryName"
          value={params.formObject.queryName}
          onChange={handleChange}
        />
      </div>

      <div className="query-form-group">
        <label htmlFor="q">Query Text:</label>
        <input
          type="text"
          id="q"
          name="q"
          value={params.formObject.q}
          onChange={handleChange}
        />
      </div>

      {/* Admin-only extra fields */}
      <div
        className={currentUserIsAdmin() ? "visible admin-extra-fields" : "hidden"}
      >
        <div className="query-form-group">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            name="language"
            value={params.formObject.language || ""}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            {/* Add more language options as needed */}
          </select>
        </div>

        <div className="query-form-group">
          <label htmlFor="pageSize">Page Size:</label>
          <input
            type="number"
            id="pageSize"
            name="pageSize"
            min={1}
            max={100}
            value={params.formObject.pageSize || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="submit-button-container">
        <input type="submit" value="Submit" className="submit-button" />
      </div>
    </form>
  );
}
