import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Path to the file that stores queries
const queriesFilePath = path.resolve("queries.json");

// POST /queries - Save entire query array to queries.json
router.post('/', (req, res) => {
  const queriesArray = req.body;

  if (!Array.isArray(queriesArray)) {
    return res.status(400).json({ error: "Request body must be an array of queries" });
  }

  try {
    const jsonString = JSON.stringify(queriesArray, null, 2); // Pretty print with 2 spaces indent
    fs.writeFileSync(queriesFilePath, jsonString, "utf-8");
    res.status(200).json({ message: "query array saved" });
  } catch (err) {
    console.error("Failed to save queries.json:", err);
    res.status(500).json({ error: "Failed to save query array" });
  }
});

// GET /queries - Read and return the saved query array
// GET /queries - Read and return the saved query array
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(queriesFilePath, "utf-8");
    res.status(200).send(data);
  } catch (err) {
    console.error("Failed to read queries.json:", err);
    res.status(404).json({ error: "queries.json file not found" });
  }
});

export default router;
