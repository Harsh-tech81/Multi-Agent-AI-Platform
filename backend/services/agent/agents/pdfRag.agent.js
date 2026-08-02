import fs from "fs";
import { PDFParse } from "pdf-parse";
import { getModel, retryInvoke } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { vectorDbConfig } from "../config/vectorDb.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
export const pdfRagAgent = async (state) => {
  try {
    const buffer = fs.readFileSync(state.file.path);
    const pdf = new PDFParse({
      data: buffer,
    });
    const res = pdf.getText();
    const text = res.text;
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.createDocuments([text]);
    const collectionName = `pdf-${Date.now()}`;
    const store = await vectorDbConfig(docs, collectionName);
    const relevantDocs = await store.similaritySearch(state.prompt, 5);
    const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");
    const llm = await getModel("pdf-Rag");
    const messages = [
      new SystemMessage(`
        You are AgentFlow-AI PDF Assistant.

Rules:
-Answer ONLY from the uploaded PDF content.
-Never make up information.
-If the answer is not present in the PDF, reply:
- "I couldn't find the answer in the PDF. Please provide more details or ask a different question."
- Use Markdown formatting for your response.

      `),

      new HumanMessage(`
        Context:
        ${context}
        Question:
        ${state.prompt}
        `),
    ];

    const response = await retryInvoke(llm, messages);
        await deductCredits(state.userId, "pdf");

    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    console.error("Error in pdfRagAgent:", error);
    return {
      ...state,
      aiResponse: "Sorry, something went wrong. Please try again.",
    };
  } finally {
    // Clean up the uploaded file after processing
    if (state.file && state.file.path) {
      fs.unlinkSync(state.file.path, (err) => {
        if (err) {
          console.error("Error deleting uploaded file:", err);
        }
      });
    }
  }
};
