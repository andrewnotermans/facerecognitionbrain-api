import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import knex from "knex";

import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfile from "./controllers/profile.js";
import { handleApiCall, handleImage } from "./controllers/image.js";

const saltRounds = 10;

dotenv.config();
// Database setup
const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

// Express app setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", async (req, res) => {
  try {
    const users = await db.select("*").from("users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch users" });
  }
});

app.post("/signin", (req, res) => {
  handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  handleProfile(req, res, db);
});

app.post("/imageurl", (req, res) => handleApiCall(req, res));

app.put("/image", (req, res) => {
  handleImage(req, res, db);
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log(process.env);
