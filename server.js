// server.js
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
//import knex from "knex";
import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfile from "./controllers/profile.js";
import { handleApiCall, handleImage } from "./controllers/image.js";

const saltRounds = 10;

import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

const db = client.query("SELECT * FROM users", (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

// db.select("*")
//   .from("users")
//   .then((data) => {
//     console.log("Database connection successful:", data);
//   })
//   .catch((err) => console.error("Database connection error:", err));

// Express app setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// const corsOptions = {
//   origin: "*", // Allow requests from the frontend
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
// };
app.use(cors());

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("success");
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
