import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import router from "./routes/agent.route.js";

const PORT = process.env.PORT || 8003;

const app = express();
app.use(express.json());
app.use("/", router);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Agent Service is running" });
});

app.listen(PORT, () => {
  console.log(`Agent Service is running on port ${PORT}`);
  connectDb();
});
