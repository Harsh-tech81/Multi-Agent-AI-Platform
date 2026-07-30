import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel, retryInvoke } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
  try{

  
  const llm = await getModel("chat");
  const history = await getMemory(state.conversationId);

  const searchContext = state.searchResults && state.searchResults.length > 0
    ? `
Web Search Results:
${state.searchResults
  .map((r, i) => `${i + 1}. ${r.title}\n   ${r.content}\n   Source: ${r.url}`)
  .join("\n\n")}
Answer the user using only the above search results.
`
    : "";

  const Systemprompt = `You are AgentFlow AI, an Intelligent AI assistant.

  ${searchContext}
  If searchContext exists : 
-Use search results to answer.
- Do not mention internal tools.

Rules:
-For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics , use clean Markdown.


Formatting : 

-Use # for titles and ## for sections
- Leave a blank line after headings.
-Use bullet points for lists.
-Use numbered lists for steps.
- Use fenced code blocks with language tags for code.

- Keep paragraphs short and readable.
- Never write headings and content on the same line.

- Never generate large walls of text.

`;

  const messages = [new SystemMessage(Systemprompt)];

  history.forEach((msg) => {
    if (!msg.content) return;
    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    } else {
      messages.push(new AIMessage(msg.content));
    }
  });

  messages.push(new HumanMessage(state.prompt));
  //   console.log(messages);

  const response = await retryInvoke(llm, messages);

  return {
    ...state,
    aiResponse: response.content,
  };
}catch(err){
  console.error("Error in chatAgent:", err);
  return {
    ...state,
    aiResponse: "Sorry, something went wrong. Please try again.",
  }
}
};
