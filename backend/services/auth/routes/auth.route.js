import express from "express";
import {login,logOut,updateUserPlan,getMe,deductCredits} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", login);
router.get("/logout", logOut);
router.post("/update-plan",updateUserPlan);
router.post("/deduct-credits", deductCredits);

router.get("/me", getMe);

export default router;