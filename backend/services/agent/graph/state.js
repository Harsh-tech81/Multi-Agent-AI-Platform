import { Annotation } from "@langchain/langgraph";

// creating a custom state for the agent to store the prompt and the AI response in LangGraph. This state can be used to keep track of the conversation context and any relevant information that the agent needs to remember during its interactions with users.


export const agentState = Annotation.Root({
  prompt: Annotation(),
  aiResponse: Annotation(),
});
