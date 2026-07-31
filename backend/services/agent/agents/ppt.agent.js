import { getModel, retryInvoke } from "../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { generatePPT } from "../utils/generatePPT.js";

export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");
    const res = await retryInvoke(
      llm,
      `
You are a professional presentation designer.

Return ONLY valid JSON.
Format : 
{

"title":"",
"subtitle":"",
"slides":[

{
"title":"",
"points":[
"",
"",
"",
""
]
}

]

}

Rules:
- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- Do not return markdown.
- Do not return explanations.
- Do not give any code blocks or formatting in the response.
- Return ONLY JSON.

Topic:
${state.prompt}

      `,
    );
    const data = JSON.parse(res.content);
    const ppt = await generatePPT(data);
    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    const filename = `presentation-${Date.now()}.pptx`;
    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    const pptUrl = await getFromS3(filename, 24 * 60 * 60); // 24-hour expiration
    return {
      ...state,
      aiResponse: ` # PPT Generated Successfully
**${data.title}**
 📩 [Download PPT](${pptUrl})
 ⌛ Link expires in 24 hours.
`,
    };
  } catch (err) {
    console.error("Error in pptAgent:", err);
    return {
      ...state,
      aiResponse: "Sorry, something went wrong. Please try again.",
    };
  }
};
