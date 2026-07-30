import { getModel, retryInvoke } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  try{

  
  const intentllm = await getModel("intent");
  const llm = await getModel("coding");
  //   first find the intent of the user prompt using a llm model.
  const intentRes = await retryInvoke(intentllm, `
    You are an intent classifier.

    Return ONLY one of these values.

    CODE_GENERATION
    CODE_REVIEW
    CODE_EXPLANATION
    DEUGGING
    OPTIMIZATION
    CONVERSION
    DOCUMENTATION

    User Request:
    ${state.prompt}
    
    `);
  const intent = intentRes.content?.trim() || "";
  if (intent.includes("CODE_GENERATION")) {
    const prompt = `
You are AgentFlow AI Coding Agent.
Generate the requested project.

Default stack:
-HTML
-CSS
-JavaScript

Use React / Next.js / Vue ONLY if explicitly requested by the user.


Rules:

-Responsive
-Modern UI 
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
-Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.

IMAGES 
==================
Always use real unsplash Images.
Never use placeholders.

RETURN ONLY VALID JSON.
Schema:

{
"files":[
{
"name":"index.html",
"content":"..."
},
{
"name":"style.css",
"content":"..."

},
{
"name":"script.js",
"content":"..."
}
]
}

Rules:
-Output must start with {
-Output must end with }
-No markdown
-No explanation
- No extra text
- No \`\`\`
- never mention intent

User Request:
${state.prompt}

`;

    const res = await retryInvoke(llm, prompt);
    // Strip markdown code fences if LLM wraps the JSON (e.g. ```json ... ```)
    let raw = res.content.trim();
    if (raw.startsWith("```")) {
      raw = raw.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }
    const data = JSON.parse(raw);
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
