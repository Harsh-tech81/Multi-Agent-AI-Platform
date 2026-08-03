import { searchTool } from "../config/tavily.js";
import { checkAgentLimit } from "../config/agent.limit.js";
import { deductCredits } from "../utils/deductCredits.js";
export const searchAgent = async (state) => {
  try {
    await checkAgentLimit("search", state.userId);
    const raw = await searchTool.invoke({
      query: state.prompt,
    });

    // TavilySearch tool returns a JSON string — parse it
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    await deductCredits(state.userId, "search");
    console.log("search results", parsed);

    // images array contains objects: { url, description } — extract just URLs
    const images = (parsed.images || []).map((img) =>
      typeof img === "string" ? img : img.url,
    );

    return {
      ...state,
      searchResults: parsed.results || parsed,
      images,
    };
  } catch (err) {
    console.error("Search agent error:", err.message);
    return {
      ...state,
          aiResponse: err?.data?.message ||  "Sorry, something went wrong. Please try again.",

      searchResults: [],
      images: [],
    };
  }
};
