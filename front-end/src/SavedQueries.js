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
      let trimTitle = item.queryName.substring(0, 30);
      return (
        <li
          key={idx}
          onClick={() => onSavedQueryClick(item)}
          className={
            item.queryName === params.selectedQueryName ? "selected" : ""
          }
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{trimTitle + ': "' + item.q + '"'}</span>
          <button
            onClick={(e) => onDeleteClick(e, item)}
            style={{ marginLeft: "10px", cursor: "pointer" }}
            aria-label={`Delete saved query ${item.queryName}`}
          >
            Delete
          </button>
        </li>
      );
    });
  }

  return (
    <div>
      <ul>
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
          style={{ marginBottom: "10px", cursor: "pointer" }}
          aria-label="Reset all saved queries"
        >
          Delete All
        </button>
      )}
    </div>
  );
}
