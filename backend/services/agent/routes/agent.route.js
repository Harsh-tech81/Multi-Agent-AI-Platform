import express from "express";
import { upload } from "../config/multer.js";
import {agent} from "../controllers/agent.controller.js";
const router=express.Router();

router.post("/chat",upload.single("file"),agent);

export default router;