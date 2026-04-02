import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { calculator, wordCounter } from "./tools.js";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function runAgent(query) {
  try {
    // Tool routing
    if (query.includes("calculate")) {
      return await calculator.func({
        expression: query.replace("calculate", ""),
      });
    }

    if (query.includes("word count")) {
      return await wordCounter.func({ text: query });
    }

    // Normal LLM
    const response = await llm.invoke(query);
    return response.content;
  } catch (error) {
    console.error(error);
    return "Something went wrong";
  }
}
