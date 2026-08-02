import { getModel, retryInvoke } from "../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
export const visionAgent = async (state) => {
  try {
    const llm = await getModel("image");
    const res = await retryInvoke(
      llm,
      `
    You are an elite AI image prompt engineer.
Convert the user request into a highly detailed image generation prompt.

Requirements:

-Cinematic lighting
-Professional composition
-Ultra-realistic
-High detail
-Beautiful color palette
-Sharp focus
- 8k quality
- photorealistic
- Depth of field
- Professional photography
- stunning visuals


Return only the image prompt.

User Request: ${state.prompt}

    `,
    );

    const prompt = res?.content?.trim() || "";
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
    await deductCredits(state.userId, "vision"); // Deduct credits for the user before processing the chat request
    const buffer = Buffer.from(imageRes.data);
    const fileName = `image-${Date.now()}.png`;
    await uploadToS3(fileName, buffer, "image/png");
    const downloadUrl = await getFromS3(fileName, 24 * 60); // 24 hours
    return {
      ...state,
      aiResponse: `
![Generated Image](${downloadUrl})
 📩 [Download Image](${downloadUrl})
 ⌛ Link expires in 10 minutes.
`,
    };
  } catch (err) {
    console.error(err);
    return {
      ...state,
      aiResponse: "Failed to generate image. Please try again later.",
    };
  }
};
