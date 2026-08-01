

export const getCurrUser = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
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
    return res.status(200).json(req.user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching current user", error: error.message });
  }
};
