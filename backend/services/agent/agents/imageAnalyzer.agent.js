import { getModel, retryInvoke } from "../config/llmModels.js";
import axios from "axios";
import fs from "fs";
import { deductCredits } from "../utils/deductCredits.js";
export const imageAnalyzerAgent = async (state) => {
  try {
    const llm = await getModel("imageAnalyzer");
    const imageBuffer = await fs.readFile(state.file.path);
    const base64Image = imageBuffer.toString("base64");
    const messages = [
      new SystemMessage(`
        You are AgentFlow-AI image analyzer Agent.
        Rules:

        -Analyze only the uploaded image.
        -Answer the user's Question accurately
        -If text exists in the image, extract it and provide it in your answer.
        -If something is unclear in the image, ask the user for clarification.
        -Use Markdown formatting for your response.
        - Do not hallucinate or make assumptions about the image content.
        
        `),
      new HumanMessage({
        content: [
          {
            type: "text",
            text:
              state.prompt ||
              "Please analyze the uploaded image and provide insights.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];

    const res = await retryInvoke(llm, messages);
    await deductCredits(state.userId, "vision");
    return {
      ...state,
      aiResponse: res.content,
    };
  } catch (err) {
    console.error("Error in imageAnalyzerAgent:", err);
    return {
      ...state,
      aiResponse: "Sorry, something went wrong. Please try again.",
    };
  } finally {
    // Clean up the uploaded file after processing
    if (state.file && state.file.path) {
      fs.unlink(state.file.path, (err) => {
        if (err) {
          console.error("Error deleting uploaded file:", err);
        }
      });
    }
  }
};
