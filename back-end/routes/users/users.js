import express from "express";
import { client, connect } from './db.js';

const dbName = 'usersdb';
const collectionName = 'users';

connect();  // Connect to MongoDB as soon as this file is loaded

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Only return username and email fields, exclude _id and password
    const prj = { user: 1, email: 1, _id: 0 };

    const users = await collection.find({}).project(prj).toArray();

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users/authenticate
router.post('/authenticate', async (req, res) => {
  try {
    const loginCredentials = req.body;
    const { user, password } = loginCredentials;

    if (!user || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const existingUser = await collection.findOne({ user: user });

    if (!existingUser) {
      return res.status(401).json({ error: "Unauthorized - user not found" });
    }

    if (existingUser.password === password) {
      return res.status(200).json({ message: "Authentication successful" });
    } else {
      return res.status(401).json({ error: "Unauthorized - incorrect password" });
    }
  } catch (err) {
    console.error("Error in authentication:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// router.post('/', async (req, res) => {
//     res.send("POST called");  
// });

export default router;