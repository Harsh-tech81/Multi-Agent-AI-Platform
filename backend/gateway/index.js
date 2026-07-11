import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import {proxyWithHeader} from "./utils/proxyWithHeader.js";
dotenv.config();
import protect from "./middleware/auth.middleware.js";
import { getCurrUser } from "./controllers/user.controller.js";
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(cookieParser());
const PORT = process.env.PORT || 8000;

app.use("/api/auth",proxy( process.env.AUTH_SERVICE_URL));
app.use("/api/chat",proxyWithHeader( process.env.CHAT_SERVICE_URL));
app.get("/api/me", protect, getCurrUser);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Gateway is running" });
});

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
