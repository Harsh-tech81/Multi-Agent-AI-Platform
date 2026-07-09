import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;


app.get("/", (req, res) => {
  res.status(200).json({ message: "Auth Service is running" });
});

app.listen(PORT, () => {
  console.log(`Auth Service is running on port ${PORT}`);
  connectDb();
});
