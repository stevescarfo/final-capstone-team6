import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Load API key from environment variable
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.log(
    "Please set the API_KEY environment variable with a valid newsapi.org apiKey and restart the server!"
  );
  process.exit(0);
}

// Base URL for newsapi top headlines endpoint
const baseUrlTop = "https://newsapi.org/v2/top-headlines";

// Function to add apiKey to the query object
function addApiKey(queryObject) {
  return { ...queryObject, apiKey: apiKey };
}

// Function to create a full URL from the query object with apiKey
export function createUrlFromQueryObject(queryObjectWithApiKey) {
  const queryString = new URLSearchParams(queryObjectWithApiKey).toString();
  const url = baseUrlTop + "?" + queryString;
  return url;
}

// Function to fetch data from a given URL
export async function fetchData(url) {
  let data = null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

router.get("/", async (req, res) => {
  // Hard-coded query object
  let fixedQueryObject = {
    country: "us",
    q: "news",
  };

  // Add apiKey to query object
  let queryObject = addApiKey(fixedQueryObject);

  // Create URL from query object
  let url = createUrlFromQueryObject(queryObject);

  // Fetch news articles data from API
  let newsArticles = await fetchData(url);

  // Send fetched data as response
  res.send(newsArticles);
});

router.post("/", async (req, res) => {
  // Hard-coded query object
  let fixedQueryObject = {
    country: "us",
    q: "news",
  };

  // Add apiKey to query object
  let queryObject = addApiKey(fixedQueryObject);

  // Create URL from query object
  let url = createUrlFromQueryObject(queryObject);

  // Fetch news articles data from API
  let newsArticles = await fetchData(url);

  // Send fetched data as response
  res.send(newsArticles);
});



export default router;
