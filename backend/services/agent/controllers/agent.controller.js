import axios from "axios";
import { graph } from "../graph/graph.js";
import redis from "../../../shared/redis/redis.js";
import { addMessage } from "../config/memory.js";
export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    const file = req.file; // Get the uploaded file from the request
    const userId = req.headers["x-user-id"] || req.user?.id; // Get userId from headers or req.user
    await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
      content: prompt,
      conversationId,
      role: "user",
    });
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
      userId,
      file,
    });
    const response = result?.aiResponse;
    const images = result?.images || [];

    if (response) {
      await addMessage(conversationId, "user", prompt);
      await addMessage(conversationId, "assistant", response);
      await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
        content: response,
        conversationId,
        role: "assistant",
        images: result?.images,
        artifacts: result?.artifacts || [],
      });
    }

    return res
      .status(200)
      .json({
        answer: response,
        images: images,
        artifacts: result?.artifacts || [],
      });
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Agent Error",
        message: err?.message || "Something went wrong",
      });
  }
};
