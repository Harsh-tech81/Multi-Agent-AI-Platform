import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }
    const sessionId = crypto.randomUUID();

    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        _id: user._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      }),
      "EX",
      60 * 60 * 24 * 7,
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login Error", error: error.message });
  }
};

export const logOut = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    await redis.del(`session:${sessionId}`);
    res.clearCookie("session");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Logout Error", error: error.message });
  }
};

export const updateUserPlan = async (req, res) => {
  try {
    const { plan, credits, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.plan = plan;
    user.credits+= credits;
    user.totalCredits+= credits;
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Set plan expiration to 30 days from now
    await user.save();
    // Update all active sessions for this user in Redis
    const keys = await redis.keys("session:*");
    for (const key of keys) {
      const sessionData = await redis.get(key);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.userId === String(user._id) || parsed._id === String(user._id)) {
          await redis.set(
            key,
            JSON.stringify({
              ...parsed,
              _id: user._id,
              userId: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              plan: user.plan,
              credits: user.credits,
              totalCredits: user.totalCredits,
              planExpiresAt: user.planExpiresAt,
            }),
            "EX",
            60 * 60 * 24 * 7
          );
        }
      }
    }

      
    return res
      .status(200)
      .json({ message: "User plan updated successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Update User Plan Error", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Get Me Error", error: error.message });
  }
};
