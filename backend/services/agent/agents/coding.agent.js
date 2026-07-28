import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  const intentllm = await getModel("intent");
  const llm = await getModel("coding");
  //   first find the intent of the user prompt using a llm model.
  const intentRes = await intentllm.invoke(`
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
  const intent = intentRes.content;
  if (intent === "CODE_GENERATION") {
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

const res = await llm.invoke(prompt);
const data=JSON.parse(res.content);
return{
    ...state,
    aiResponse:"Code generated successfully.",
    artifacts:[
        {
            id:Date.now(),
            type:"Project",
            files:data.files || [],
        }
    ],
    
}

  }
};
