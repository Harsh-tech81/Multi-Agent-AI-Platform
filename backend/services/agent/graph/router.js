import { getModel, retryInvoke } from "../config/llmModels.js";

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
  }

  if (state.file.mimetype === "application/pdf") {
    return {
      ...state,
      agent: "pdfRag",
    };
  }

  if (
    state.file.mimetype === "image/png" ||
    state.file.mimetype === "image/jpeg" ||
    state.file.mimetype === "image/jpg" ||
    state.file.mimetype === "image/webp"
  ) {
    return {
      ...state,
      agent: "imageAnalyzer",
    };
  }

  const llm = await getModel("router");
  const prompt = `You are an agent router,
  Available agents : 
  -chat
  -search
  -coding
  -pdf
  -ppt
  -vision

  Rules:

  chat:
  General conversation,
  explanations,
  learning,
  questions.

  search:
  Current events,
  latest information,
  news,
  recent developments,
  internet lookup.

  coding:
  Generate code,
  debug code,
  build projects,
  architecture,
  API design.

  pdf:
  Questions about generate PDFs
  or docuement context.
  
 ppt:
 Questions about generate PPTs
 or ppt context.

vision : 
  Generate image,
  create image.


 Return ONLY one word:

 chat
 search
 coding
 pdf
 ppt
 vision

 User Query: ${state.prompt}
  `;

  const response = await retryInvoke(llm, prompt);
  const raw = response.content.trim().toLowerCase();

  // Extract valid agent name even if LLM returns extra text
  const validAgents = ["chat", "search", "coding", "pdf", "ppt", "vision"];
  const matched = validAgents.find((a) => raw === a || raw.includes(a));
  const agent = matched || "chat"; // fallback to chat if no match

  return {
    ...state,
    agent,
  };
};
