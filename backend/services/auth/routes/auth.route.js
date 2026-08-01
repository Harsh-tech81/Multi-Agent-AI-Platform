import express from "express";
import {login,logOut,updateUserPlan} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", login);
router.get("/logout", logOut);
router.get("/update-plan",updateUserPlan);

export default router;