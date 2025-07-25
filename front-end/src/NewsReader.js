import { QueryForm } from "./QueryForm";
import { Articles } from "./Articles";
import { SavedQueries } from "./SavedQueries";
import { LoginForm } from "./LoginForm.js";
import { useState, useEffect } from "react";
import { exampleQuery, exampleData } from "./data";

export function NewsReader() {
  // Query and news data state
  const [query, setQuery] = useState(exampleQuery);
  const [data, setData] = useState(exampleData);
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });

  // API endpoints
  const urlNews = "/news";
  const urlQueries = "/queries";
  const urlUsersAuth = "/users/authenticate";

  // Saved queries state
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);

  // User auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });

  // Query Details visibility state
  const [showQueryDetails, setShowQueryDetails] = useState(false);

  // Adding canned queries
  const cannedQueries = [
    { queryName: "Top Headlines", q: "headlines" },
    { queryName: "Technology News", q: "technology" },
    { queryName: "Sports Highlights", q: "sports" },
  ];

  // Fetch news when query changes
  useEffect(() => {
    getNews(query);
  }, [query]);

  // Load saved queries once on mount
  useEffect(() => {
    getQueryList();
  }, []);

  // Load saved queries from backend
  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        console.log("savedQueries has been retrieved: ");
        setSavedQueries(data);
      }
    } catch (error) {
      console.error("Error fetching saved queries:", error);
    }
  }

  // Save updated queries list to backend
  async function saveQueryList(savedQueries) {
    try {
      const response = await fetch(urlQueries, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("savedQueries array has been persisted:");
    } catch (error) {
      console.error("Error saving saved queries:", error);
    }
  }

  // Handler to delete a saved query
  function onDeleteSavedQuery(queryToDelete) {
    const filteredQueries = savedQueries.filter(
      (q) => q.queryName !== queryToDelete.queryName
    );
    setSavedQueries(filteredQueries);
    if (query.queryName === queryToDelete.queryName) {
      setData({});
      setQueryFormObject({
        queryName: "",
        q: "",
        language: "",
        pageSize: 5,
      });
      setQuery({});
    }
    saveQueryList(filteredQueries); // persist deletion to backend
  }

  function onResetQueries() {
    setSavedQueries([]);
    setData({});
    setQueryFormObject({
      queryName: "",
      q: "",
      language: "",
      pageSize: 5,
    });
    setQuery({});
    saveQueryList([]); // persist empty list to backend
  }

  // Login/logout function
  async function login() {
    if (currentUser) {
      // Logout
      setCurrentUser(null);
    } else {
      // Login
      try {
        const response = await fetch(urlUsersAuth, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (response.status === 200) {
          setCurrentUser({ user: credentials.user });
          setCredentials({ user: "", password: "" });
        } else {
          alert("Error during authentication");
        }
      } catch (error) {
        alert("Error during authentication");
        console.error("Login error:", error);
      }
    }
  }

  // Method to check if current user matches given username
  function currentUserMatches(user) {
    return currentUser?.user === user;
  }

  // Handler for selecting a saved query
  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  // Handler for submitting a new query with guest user restrictions
  function onFormSubmit(queryObject) {
    if (currentUser === null) {
      alert("Log in if you want to create new queries!");
      return;
    }
    if (savedQueries.length >= 3 && currentUserMatches("guest")) {
      alert(
        "guest users cannot submit new queries once saved query count is 3 or greater!"
      );
      return;
    }

    const filteredQueries = savedQueries.filter(
      (q) => q.queryName !== queryObject.queryName
    );
    const newSavedQueries = [queryObject, ...filteredQueries];

    console.log(JSON.stringify(newSavedQueries));
    saveQueryList(newSavedQueries);
    setSavedQueries(newSavedQueries);
    setQuery(queryObject);
  }

  // Fetch news articles from backend
  async function getNews(queryObject) {
    if (!queryObject.q) {
      setData({});
      return;
    }

    try {
      const response = await fetch(urlNews, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryObject),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newsData = await response.json();
      setData(newsData);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setData({});
    }
  }

  return (
    <div>
      <div>
        <section className="parent">
          {/* Login form component */}
          <LoginForm
            currentUser={currentUser}
            credentials={credentials}
            setCredentials={setCredentials}
            login={login}
          />

          {/* Query Form */}
          {currentUser && (
            <div className="box">
              <h2 className="section-title">Query Form</h2>
              <QueryForm
                currentUser={currentUser}
                setFormObject={setQueryFormObject}
                formObject={queryFormObject}
                submitToParent={onFormSubmit}
              />
            </div>
          )}

          {/* Saved Queries */}
          <div className="box">
            <h2 className="section-title sticky-title">Saved Queries</h2>
            {currentUser ? (
              <div className="queries-container">
                <SavedQueries
                  savedQueries={savedQueries}
                  selectedQueryName={query.queryName}
                  onQuerySelect={onSavedQuerySelect}
                  onDeleteQuery={onDeleteSavedQuery}
                  onResetQueries={onResetQueries}
                  currentUser={currentUser}
                />
              </div>
            ) : (
              <SavedQueries
                savedQueries={cannedQueries}
                selectedQueryName={query.queryName}
                onQuerySelect={onSavedQuerySelect}
                // No delete/reset handlers since canned queries cannot be modified
              />
            )}
          </div>

          {/* Articles List */}
          <div className="box">
            <h2 className="section-title sticky-title">Articles List</h2>
            <div className="articles-container">
              {currentUser && (
                <p>
                  <strong>Query:</strong> {query.queryName || "(no query)"}
                </p>
              )}

              {/* Query Details toggle button */}
              {currentUser && (
                <button
                  onClick={() => setShowQueryDetails(!showQueryDetails)}
                  style={{ marginBottom: "10px", cursor: "pointer" }}
                >
                  {showQueryDetails ? "Hide Query Details" : "Query Details"}
                </button>
              )}

              {/* Conditionally show query details */}
              {currentUser && showQueryDetails && (
                <div
                  style={{
                    backgroundColor: "#f0f0f0ff",
                    padding: "5px",
                    borderRadius: "4px",
                    marginBottom: "5px",
                    fontSize: "14px",
                    lineHeight: "1.0",
                  }}
                >
                  <p>
                    <strong>Query:</strong> {queryFormObject.q || "(none)"}
                  </p>
                  <p>
                    <strong>Language:</strong>{" "}
                    {queryFormObject.language || "(default)"}
                  </p>
                  <p>
                    <strong>Page Size:</strong>{" "}
                    {queryFormObject.pageSize ?? "(default)"}
                  </p>
                  <p>
                    <strong>Count:</strong> {data.totalResults ?? "(default)"}
                  </p>
                </div>
              )}

              <Articles query={query} data={data} currentUser={currentUser} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
