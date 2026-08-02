import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
  
});
const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",

});

const openRouter = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    temperature: 0,
    maxTokens: 16000,
});


export const getModel=async (agent) => {
    switch (agent) {
        case 'chat':
            return groq;
        case 'search':
            return groq;
        case 'imageAnalyzer':
            return gemini;
        case 'coding':
            return openRouter;
        default:
            return groq;
    }
};

// Retry wrapper for LLM calls — handles rate limits (429) and transient errors
export const retryInvoke = async (llm, input, maxRetries = 3) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await llm.invoke(input);
        } catch (err) {
            const status = err?.response?.status || err?.status || err?.code;
            const isRateLimit = status === 429 || (err?.message && err.message.includes("rate limit"));
            const isTransient = status >= 500 || isRateLimit;

            if (!isTransient || attempt === maxRetries) {
                throw err;
            }

            // Exponential backoff: 2s, 4s, 8s
            const delay = Math.pow(2, attempt + 1) * 1000;
            console.warn(`LLM rate limited/error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};