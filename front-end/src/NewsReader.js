import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { SavedQueries } from './SavedQueries';
import { useState, useEffect } from 'react';
import { exampleQuery, exampleData } from './data';
import { LoginForm } from './LoginForm';


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
      console.error('Error fetching saved queries:', error);
    }
  }

  // Save updated queries list to backend
  async function saveQueryList(savedQueries) {
    try {
      const response = await fetch(urlQueries, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("savedQueries array has been persisted:");
    } catch (error) {
      console.error('Error saving saved queries:', error);
    }
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify(credentials)
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

  // Handler for selecting a saved query
  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  // Handler for submitting a new query
  function onFormSubmit(queryObject) {
    let newSavedQueries = [];
    newSavedQueries.push(queryObject);

    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }

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
        <div className="box">
          <span className='title'>Query Form</span>
          <QueryForm
            setFormObject={setQueryFormObject}
            formObject={queryFormObject}
            submitToParent={onFormSubmit}
          />
        </div>

        {/* Saved Queries */}
        <div className="box">
          <span className='title'>Saved Queries</span>
          <SavedQueries
            savedQueries={savedQueries}
            selectedQueryName={query.queryName}
            onQuerySelect={onSavedQuerySelect}
          />
        </div>

        {/* Articles List */}
        <div className="box">
          <span className='title'>Articles List</span>
          <Articles query={query} data={data} />
        </div>

      </section>
    </div>
  </div>
);

}
