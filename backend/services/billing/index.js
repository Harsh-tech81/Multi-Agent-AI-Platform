import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8001;


app.get("/", (req, res) => {
  res.status(200).json({ message: "Billing Service is running" });
});

app.listen(PORT, () => {
  console.log(`Billing Service is running on port ${PORT}`);
  connectDb();
});
