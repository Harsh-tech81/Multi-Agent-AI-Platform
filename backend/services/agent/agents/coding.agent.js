import { getModel, retryInvoke } from "../config/llmModels.js";
import { parseLLMJson } from "../utils/parseLLMJson.js";

export const codingAgent = async (state) => {
  try {
    const intentllm = await getModel("intent");
    const llm = await getModel("coding");
    // first find the intent of the user prompt using an LLM model.
    const intentRes = await retryInvoke(
      intentllm,
      `
    You are an intent classifier.

    Return ONLY one of these values:
    CODE_GENERATION
    CODE_REVIEW
    CODE_EXPLANATION
    DEUGGING
    OPTIMIZATION
    CONVERSION
    DOCUMENTATION

    User Request:
    ${state.prompt}
    `
    );
    const intent = intentRes.content?.trim() || "";
    if (intent.includes("CODE_GENERATION")) {
      const prompt = `
You are AgentFlow AI Coding Agent.
Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested by the user.

Rules:
- Responsive
- Modern UI 
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.

IMAGES:
Always use real unsplash Images.
Never use placeholders.

CRITICAL INSTRUCTIONS FOR JSON OUTPUT:
- Return ONLY a valid JSON object matching the schema below.
- Do NOT wrap in markdown code fences (\`\`\`json).
- Do NOT include any explanations or extra text outside JSON.
- Make sure all double quotes inside file content strings are properly escaped with backslashes (\\") or use single quotes where possible.

JSON Schema:
{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

User Request:
${state.prompt}
`;

      const res = await retryInvoke(llm, prompt);
      const data = parseLLMJson(res.content);

      return {
        ...state,
        aiResponse: "Code generated successfully.",
        artifacts: [
          {
            id: Date.now(),
            type: "Project",
            files: data.files || [],
            title: state.prompt,
          },
        ],
      };
    }

  const res = await retryInvoke(llm, `
    The user's request is: ${intent}

    Return Markdown only.
    Never generate project files.
    Use headings like:
    # Overview
    ## Explanation
    ## Problems
    ## Improvements
    ## Best Practices
## Optimized Code(if needed)
    User Request:
    ${state.prompt}
    `);

  const data = res.content;
  return {
    ...state,
    aiResponse: data,
    artifacts: [],
  };
}catch(err){
  console.error("Error in codingAgent:", err);
  return {
    ...state,
    aiResponse: "Sorry, something went wrong. Please try again.",
  }
}
};
