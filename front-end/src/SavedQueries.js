export function SavedQueries(params) {
  function onSavedQueryClick(savedQuery) {
    params.onQuerySelect(savedQuery);
  }

  function onDeleteClick(e, savedQuery) {
    e.stopPropagation(); // Prevent triggering onSavedQueryClick
    params.onDeleteQuery(savedQuery);
  }

  function onResetClick() {
    const confirmed = window.confirm(
      "Are you sure you want to erase the list?"
    );
    if (confirmed) {
      params.onResetQueries();
    }
  }

  function getQueries() {
    return params.savedQueries.map((item, idx) => {
      const isSelected = item.queryName === params.selectedQueryName;

      return (
        <li
          key={idx}
          onClick={
            params.currentUser ? () => onSavedQueryClick(item) : undefined
          }
          className={isSelected ? "selected" : ""}
          style={{
            padding: "8px 12px",
            cursor: params.currentUser ? "pointer" : "default", // change cursor accordingly
            borderBottom: "1px solid #ddd",
            backgroundColor: isSelected ? "#eef6ff" : "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "relative",
            userSelect: params.currentUser ? "auto" : "none", // prevent text selection if not clickable
          }}
        >
          {/* Query Name */}
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.1em",
              marginBottom: "4px",
            }}
          >
            {item.queryName}
          </div>

          {/* Query properties */}
          <div
            style={{
              fontSize: "0.85em",
              color: "#555",
              marginBottom: "6px",
            }}
          >
            <div>
              <strong>Query:</strong> {item.q}
            </div>
            {item.language && (
              <div>
                <strong>Language:</strong> {item.language}
              </div>
            )}
            {item.pageSize && (
              <div>
                <strong>Page Size:</strong> {item.pageSize}
              </div>
            )}
            {item.totalResults && (
              <div>
                <strong>Articles Returned:</strong> {item.totalResults}
              </div>
            )}
            {/* Add more properties here if needed */}
          </div>

          {/* Delete button */}
          {params.currentUser && (
            <button
              onClick={(e) => onDeleteClick(e, item)}
              style={{
                position: "absolute",
                right: "10px",
                top: "10px",
                cursor: "pointer",
                padding: "4px 8px",
              }}
              aria-label={`Delete saved query ${item.queryName}`}
            >
              Delete
            </button>
          )}
        </li>
      );
    });
  }

  return (
    <div>
      <ul style={{ listStyleType: "none", paddingLeft: 0, margin: 0 }}>
        {params.savedQueries && params.savedQueries.length > 0 ? (
          getQueries()
        ) : (
          <li>No Saved Queries, Yet!</li>
        )}
      </ul>

      {/* Show Reset button only if user is logged in */}
      {params.currentUser && (
        <button
          onClick={onResetClick}
          style={{ marginTop: "10px", cursor: "pointer" }}
          aria-label="Reset all saved queries"
        >
          Delete All
        </button>
      )}
    </div>
  );
}
