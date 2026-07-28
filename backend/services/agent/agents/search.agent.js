import { searchTool } from "../config/tavily.js";

export const searchAgent = async (state) => {
  try {
    const raw = await searchTool.invoke({
      query: state.prompt,
    });

    // TavilySearch tool returns a JSON string — parse it
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

    console.log("search results", parsed);

    // images array contains objects: { url, description } — extract just URLs
    const images = (parsed.images || []).map((img) =>
      typeof img === "string" ? img : img.url
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
      searchResults: [],
      images: [],
    };
  }
};
