import { getModel, retryInvoke } from "../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { generatePdf } from "../utils/generatePdf.js";
import { parseLLMJson } from "../utils/parseLLMJson.js";
import { deductCredits } from "../utils/deductCredits.js";
export const pdfAgent = async (state) => {
  try {
    const llm = await getModel("pdf");
    const res = await retryInvoke(
      llm,
      `
You are an expert document writer.
Return ONLY valid JSON.
Do not return markdown.
Do not return explanations.
Structure:
{
"title": "",
"subtitle": "",
"sections": [
{
"heading": "",
"points": [
    ]
}
    ]
    }


    Generate 4-8 sections.
    Each section should have 3-6 concise bullet points.

Topic:
${state.prompt}

`,
    );
    const data = parseLLMJson(res.content);
  await deductCredits(state.userId,"pdf");
    const pdfBuffer = await generatePdf(data);
    const fileName = `document-${Date.now()}.pdf`;
    await uploadToS3(fileName, pdfBuffer, "application/pdf");
    const downloadUrl = await getFromS3(fileName, 24 * 60); // 24 hours
    return {
      ...state,
      aiResponse: ` # PDF Generated Successfully
**${data.title}**
 📩 [Download PDF](${downloadUrl})
 ⌛ Link expires in 10 minutes.
`,
    };
  } catch (err) {
    console.error("Error in pdfAgent:", err);
    return {
      ...state,
      aiResponse: "Sorry, something went wrong. Please try again.",
    };
  }
};
