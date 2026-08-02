import redis from "../../shared/redis/redis.js";

export const getCurrUser = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(200).json(null);
    }
    const session = await redis.get(`session:${sessionId}`);
    if (!session) {
      return res.status(200).json(null);
    }
    const user = JSON.parse(session);
    const userId = user?.userId || user?._id;
    if (!userId) {
      return res.status(200).json(null);
    }
    const authRes = await fetch(`${process.env.AUTH_SERVICE_URL}/me`, {
      headers: {
        "x-user-id": String(userId),
      },
    });
    if (authRes.ok) {
      const userData = await authRes.json();
      return res.status(200).json(userData);
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getCurrUser:", error.message);
    return res.status(200).json(null);
  }
};
