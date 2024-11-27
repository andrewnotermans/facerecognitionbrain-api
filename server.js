import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import { Client } from "pg";

import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfile from "./controllers/profile.js";
import { handleApiCall, handleImage } from "./controllers/image.js";

const saltRounds = 10;

// Initialize the database client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for Heroku's managed PostgreSQL
  },
});

client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

// Express app setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/signin", (req, res) => {
  handleSignin(req, res, client, bcrypt);
});

app.post("/register", (req, res) => {
  handleRegister(req, res, client, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  handleProfile(req, res, client);
});

app.post("/imageurl", (req, res) => handleApiCall(req, res));

app.put("/image", (req, res) => {
  handleImage(req, res, client);
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
